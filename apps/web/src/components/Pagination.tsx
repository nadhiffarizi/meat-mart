import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface IPagination {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  itemsPerPage: number;
}

export function PaginationComponent({
  page,
  setPage,
  totalCount,
  itemsPerPage,
}: IPagination) {
  const totalPage = Math.ceil(totalCount / itemsPerPage);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrev}
              className="hover:cursor-pointer"
            />
          </PaginationItem>
          <PaginationItem className="text-sm text-primaryText">
            Page {page} of {totalPage}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className="hover:cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
