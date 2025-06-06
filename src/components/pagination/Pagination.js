"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "author-design-system-react";

export default function PaginationDisDataAdmin({totalNumberOfPages, currentPage, limit}){
    const { push } = useRouter();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const mapPages = () => {
        const pages = []
        for (let i = 0; i < totalNumberOfPages; i++) {
            pages.push( {
                onClick: () => {
                    const offset = limit * i
                    const params = new URLSearchParams(searchParams);
                    params.set("limit", limit);
                    params.set("offset", offset);
                    const url = `${pathname}?${params.toString()}`;
                    push(url);
                },
                url: "#" + (i + 1)
            })
        }
        return pages
    };

    return (
        <>
            <Pagination
                currentPageNumber={currentPage}
                pages={mapPages()}
                dataTestId="dataset-series-list-pagination"
            />
        </>
  );
}
