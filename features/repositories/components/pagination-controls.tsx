"use client";

import { startTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "rc-pagination";
import enUS from "rc-pagination/lib/locale/en_US";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
};

const PAGE_SIZE = 10;

function createHref(
  pathname: string,
  searchParams: URLSearchParams,
  pageNumber: number
) {
  const nextSearchParams = new URLSearchParams(searchParams.toString());

  // Keep the first page canonical so refreshing or sharing the URL does not preserve a redundant ?page=1.
  if (pageNumber <= 1) {
    nextSearchParams.delete("page");
  } else {
    nextSearchParams.set("page", pageNumber.toString());
  }

  const queryString = nextSearchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function PaginationControls({
  currentPage,
  totalPages
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (pageNumber: number) => {
    const href = createHref(
      pathname,
      new URLSearchParams(searchParams.toString()),
      pageNumber
    );

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <nav
      className="mt-6 rounded-[24px] border border-slate-400/25 bg-white/86 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
      aria-label="Pagination"
    >
      <Pagination
        className="rc-pagination-custom"
        current={currentPage}
        total={totalPages * PAGE_SIZE}
        pageSize={PAGE_SIZE}
        locale={enUS}
        onChange={handlePageChange}
        showLessItems
        showTitle={false}
        showPrevNextJumpers
        showQuickJumper={{ goButton: true }}
        showSizeChanger={false}
        prevIcon="Previous"
        nextIcon="Next"
        jumpPrevIcon="..."
        jumpNextIcon="..."
      />
    </nav>
  );
}
