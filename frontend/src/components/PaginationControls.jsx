import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const visiblePages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      visiblePages.push(1);
      if (currentPage > 4) visiblePages.push("dots-1");

      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) visiblePages.push(i);
      }

      if (currentPage < totalPages - 3) visiblePages.push("dots-2");
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  return (
    <div className="flex justify-center mt-6 font-outfit">
      <Pagination>
        <PaginationContent className="flex items-center md:gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-pointer text-xs md:text-sm" : "cursor-pointer text-xs md:text-sm"}
            />
          </PaginationItem>

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === "number" ? (
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-xs md:text-sm font-semibold ${
                    currentPage === page
                      ? "bg-heading-1 text-white"
                      : "bg-[rgb(0,0,0,0.05)] text-heading-1 hover:bg-[rgb(0,0,0,0.07)]"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span className="px-3 py-1 text-xs md:text-sm text-gray-500 select-none">...</span>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-pointer text-xs md:text-sm" : "cursor-pointer text-xs md:text-sm"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
