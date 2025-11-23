import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const renderPages = () => {
    const pages = [];

    // If total pages are small, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const startPages = [1, 2, 3];
    const endPages = [totalPages - 1, totalPages];

    pages.push(...startPages);

    if (currentPage > 5) pages.push("start-ellipsis");

    const midStart = Math.max(currentPage - 1, 4);
    const midEnd = Math.min(currentPage + 1, totalPages - 3);

    for (let i = midStart; i <= midEnd; i++) pages.push(i);

    if (currentPage < totalPages - 4) pages.push("end-ellipsis");

    pages.push(...endPages);

    return pages;
  };

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* PREV BUTTON */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 bg-orange-200 rounded disabled:opacity-50 hover:bg-orange-300"
      >
        <HiChevronLeft size={20} />
      </button>

      {/* PAGE NUMBERS */}
      {renderPages().map((p, i) =>
        p === "start-ellipsis" || p === "end-ellipsis" ? (
          <span key={i} className="px-2 py-1 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`px-4 py-2 rounded ${
              currentPage === p
                ? "bg-orange-200 border-b-2 border-b-orange-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* NEXT BUTTON */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 bg-orange-200 rounded disabled:opacity-50 hover:bg-orange-300"
      >
        <HiChevronRight size={20} />
      </button>
    </div>
  );
};
