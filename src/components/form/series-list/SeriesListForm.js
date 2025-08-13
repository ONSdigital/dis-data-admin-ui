"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TextInput } from "author-design-system-react";

export default function SeriesListForm({datasetID}) {
    const [id, setID] = useState(datasetID || "");
    const { push } = useRouter();
    const handleSearchCLick = () => {
        if (id.length === 0) {
            push(`/series`);
            return;
        }
        push(`/series?id=${id}`);
    };
    return (
        <>    
            <TextInput id="series-list-search-by-id" 
                dataTestId="series-list-search-by-id" 
                label={{text: "Search by ID", description: "E.g \"CPIH01\" or \"my-dataset-id\""}}
                value={id}
                onChange={e => setID(e.target.value)}
                searchButton={{text: "Search", onClick: handleSearchCLick}} 
            />
        </>
    );
}