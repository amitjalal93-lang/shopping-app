"use client";
import React from "react";

const Pagination = ({ page, pages, onPageChange, isLoading = false }) => {
  if (pages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < pages) onPageChange(page + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pb-8">
      <button
        onClick={handlePrev}
        disabled={page === 1 || isLoading}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(pages)].map((_, i) => {
        const pageNumber = i + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            disabled={isLoading}
            className={`px-3 py-1 border rounded ${
              page === pageNumber ? "bg-black text-white" : "bg-white"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={page === pages || isLoading}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
