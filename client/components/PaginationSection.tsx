import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationSectionProps = {
	category: string | undefined;
	subCategory: string | undefined;
}

export function PaginationSection({ category, subCategory }: PaginationSectionProps) {
	return (
		<section className="section w-full">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href={`/catalog?category=${category}&sub=${subCategory}&page=1`}>1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href={`/catalog?category=${category}&sub=${subCategory}&page=2`} isActive>2</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href={`/catalog?category=${category}&sub=${subCategory}&page=3`}>3</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href={`/catalog?category=${category}&sub=${subCategory}&page=2`} />
					</PaginationItem>
				</PaginationContent>
    	</Pagination>
		</section>
	)
}