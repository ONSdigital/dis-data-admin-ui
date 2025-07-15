"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "author-design-system-react";

export default function PaginationDisDataAdmin({totalNumberOfPages, currentPage, limit}){
    const { push } = useRouter();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const mapPages = () => {
        const pages = [];
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);

        for (let i = 0; i < totalNumberOfPages; i++) {
            const offset = limit * i;
            params.set("offset", offset);
            const url = `${pathname}?${params.toString()}`;

            pages.push( {
                onClick: () => {
                    push(url);
                },
                url: url
            });
        }
        return pages;
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
