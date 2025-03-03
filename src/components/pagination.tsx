"use client";

import clsx from "clsx";
import { JSX } from "react";

export interface PaginationProps {
  page: number;
  total: number;
  size: number;
  onChange?: (page: number) => void;
}

export default function Pagination({
  page,
  total,
  size,
  onChange,
}: PaginationProps) {
  const totalPage = Math.ceil(total / size);
  const maxPage = Math.min(totalPage, Math.max(page + 4, 10));
  const minPage = Math.max(1, Math.min(page - 5, maxPage - 9));

  const handleChange = (index: number) => {
    onChange?.(index);
  };

  const buttons: JSX.Element[] = [];
  for (let index = minPage; index <= maxPage; index++) {
    buttons.push(
      <button
        key={index}
        className={clsx(
          "btn join-item btn-sm",
          index === page && "btn-active pointer-events-none",
        )}
        onClick={() => handleChange(index)}
      >
        {index}
      </button>,
    );
  }

  if (totalPage <= 1) {
    return null;
  }

  return (
    <div className="join">
      {minPage > 1 && (
        <button
          className="btn join-item btn-sm"
          onClick={() => handleChange(1)}
        >
          1
        </button>
      )}
      <button
        className={clsx("btn join-item btn-sm", page <= 1 && "btn-disabled")}
        onClick={() => handleChange(page - 1)}
      >
        «
      </button>
      {buttons}
      <button
        className={clsx(
          "btn join-item btn-sm",
          page >= maxPage && "btn-disabled",
        )}
        onClick={() => handleChange(page + 1)}
      >
        »
      </button>
      {maxPage < totalPage && (
        <button
          className="btn join-item btn-sm"
          onClick={() => handleChange(totalPage)}
        >
          {totalPage}
        </button>
      )}
    </div>
  );
}
