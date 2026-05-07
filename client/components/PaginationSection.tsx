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

type PaginationSectionProps = {
	pageInfo: CatalogPageInfo;
	category: string | undefined;
	subCategory: string | undefined;
}

export function catalogPageHref(opts: {
	page: number;
	category: string | undefined;
	subCategory: string | undefined;
}): string {
	const sp = new URLSearchParams();
	if (opts.category !== undefined && opts.category !== "") {
		sp.set("category", opts.category);
	}
	if (opts.subCategory !== undefined && opts.subCategory !== "") {
		sp.set("sub", opts.subCategory);
	}
	if (opts.page > 1) {
		sp.set("page", String(opts.page));
	}
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
	category,
	subCategory,
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
							href={catalogPageHref({
								page: prevPage,
								category,
								subCategory,
							})}
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
									href={catalogPageHref({
										page: m,
										category,
										subCategory,
									})}
									isActive={m === currentPage}
								>
									{m}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							href={catalogPageHref({
								page: nextPage,
								category,
								subCategory,
							})}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</section>
	);
}
