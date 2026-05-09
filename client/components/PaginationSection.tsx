import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { CatalogPageInfo } from "@/entities/domain"

export type CatalogSearchParamsLike = Record<string, string | string[] | undefined>;

type PaginationSectionProps = {
	pageInfo: CatalogPageInfo;
	searchParams: CatalogSearchParamsLike;
}

export function catalogPageHref(
	searchParams: CatalogSearchParamsLike,
	page: number,
): string {
	const sp = new URLSearchParams();

	for (const [key, raw] of Object.entries(searchParams)) {
		if (raw === undefined || raw === "") continue;
		if (key === "page") continue;
		if (Array.isArray(raw)) {
			for (const v of raw) {
				if (v !== "") sp.append(key, v);
			}
		} else {
			sp.set(key, raw);
		}
	}

	if (page > 1) sp.set("page", String(page));

	const qs = sp.toString();
	return qs === "" ? "/catalog" : `/catalog?${qs}`;
}

type PageMarker = number | "ellipsis";

/** Номера страниц и многоточия для навигатора без лишних кнопок при большом pageCount */
function paginationMarkers(currentPage: number, pageCount: number): PageMarker[] {
	if (pageCount <= 1) return [];

	if (pageCount <= 7) {
		return Array.from({ length: pageCount }, (_, i) => i + 1);
	}

	const markers = new Set<number>();
	markers.add(1);
	markers.add(pageCount);
	for (let d = -1; d <= 1; d++) {
		const p = currentPage + d;
		if (p >= 1 && p <= pageCount) markers.add(p);
	}

	const sorted = [...markers].sort((a, b) => a - b);
	const out: PageMarker[] = [];

	for (let i = 0; i < sorted.length; i++) {
		const p = sorted[i];
		const prev = sorted[i - 1];

		if (prev !== undefined && p - prev > 1) {
			out.push("ellipsis");
		}
		out.push(p);
	}

	return out;
}

export function PaginationSection({
	pageInfo,
	searchParams,
}: PaginationSectionProps) {
	const { page: currentPage, pageCount } = pageInfo;

	if (pageCount <= 1) {
		return null;
	}

	const prevPage = Math.max(1, currentPage - 1);
	const nextPage = Math.min(pageCount, currentPage + 1);
	const markers = paginationMarkers(currentPage, pageCount);

	return (
		<section className="section w-full pb-10">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={catalogPageHref(searchParams, prevPage)}
						/>
					</PaginationItem>
					{markers.map((m, idx) =>
						m === "ellipsis" ? (
							<PaginationItem key={`ellipsis-${idx}`}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={m}>
								<PaginationLink
									href={catalogPageHref(searchParams, m)}
									isActive={m === currentPage}
								>
									{m}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							href={catalogPageHref(searchParams, nextPage)}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</section>
	);
}
