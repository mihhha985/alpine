import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type StrapiWebhookPayload = {
  event?: string;
  model?: string;
  uid?: string;
  entry?: {
    id?: number | string;
    documentId?: string;
    slug?: string;
  };
};

type RevalidatePlan = {
  tags: string[];
  paths: string[];
  model: string;
  event: string;
};

export const runtime = "nodejs";

function extractProvidedSecret(request: NextRequest): string | null {
  const headerSecret = request.headers.get("x-revalidate-secret");
  if (headerSecret) return headerSecret;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return request.nextUrl.searchParams.get("secret");
}

function normalizeModel(payload: StrapiWebhookPayload): string {
  return (payload.model ?? payload.uid ?? "").toLowerCase();
}

function buildPlan(payload: StrapiWebhookPayload): RevalidatePlan {
  const tags = new Set<string>();
  const paths = new Set<string>();

  const model = normalizeModel(payload);
  const event = (payload.event ?? "unknown").toLowerCase();
  const entry = payload.entry ?? {};

  // Always keep home/catalog warm after content changes.
  paths.add("/");
  paths.add("/catalog");

  if (model.includes("category")) {
    tags.add("categories");
    tags.add("products:list");
  }

  if (model.includes("product")) {
    tags.add("products:list");

    const productId = entry.documentId ?? entry.slug ?? entry.id;
    if (productId !== undefined && productId !== null && `${productId}`.length > 0) {
      const normalizedId = `${productId}`;
      tags.add(`product:${normalizedId}`);
      paths.add(`/product/${encodeURIComponent(normalizedId)}`);
    }
  }

  // Fallback for unknown model: keep shared list pages fresh.
  if (tags.size === 0) {
    tags.add("products:list");
  }

  return {
    tags: [...tags],
    paths: [...paths],
    model,
    event,
  };
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing REVALIDATE_SECRET in environment",
      },
      { status: 500 },
    );
  }

  const providedSecret = extractProvidedSecret(request);
  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  let payload: StrapiWebhookPayload = {};
  try {
    payload = (await request.json()) as StrapiWebhookPayload;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON payload",
      },
      { status: 400 },
    );
  }

  const plan = buildPlan(payload);

  for (const tag of plan.tags) {
    revalidateTag(tag, "max");
  }

  for (const path of plan.paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    message: "Revalidation completed",
    event: plan.event,
    model: plan.model,
    revalidatedTags: plan.tags,
    revalidatedPaths: plan.paths,
  });
}
