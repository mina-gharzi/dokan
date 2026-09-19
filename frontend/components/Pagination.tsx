"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        قبلی
      </button>

      <span className="px-3 py-1 text-sm text-gray-600">
        صفحه {currentPage} از {totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        بعدی
      </button>
    </div>
  );
}