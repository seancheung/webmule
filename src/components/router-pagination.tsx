"use client";

import { useRouter } from "next/navigation";
import Pagination, { PaginationProps } from "./pagination";

export default function RouterPagination(props: PaginationProps) {
  const router = useRouter();

  function handleChange(page: number): void {
    const url = new URL(location.href);
    url.searchParams.set("p", page.toString());
    router.push(url.toString());
  }

  return <Pagination {...props} onChange={handleChange} />;
}
