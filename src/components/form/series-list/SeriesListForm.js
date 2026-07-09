"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BoxContainer, TextInput } from "@/components/design-system/DesignSystem";

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
        <BoxContainer
            borderColor="ons-color-grey-15"
            borderWidth={1}
            classes="ons-grid__col ons-u-pl-no"
            id="box-container"
            title="Filter results"
        > 
            <div className="ons-u-mt-xs">
                <TextInput id="series-list-search-by-id" 
                    dataTestId="series-list-search-by-id" 
                    label={{text: "Search by ID", description: "E.g \"CPIH01\" or \"my-dataset-id\""}}
                    value={id}
                    classes="ons-input--w-20"
                    onChange={e => setID(e.target.value)}
                    searchButton={{text: "Search", onClick: handleSearchCLick}} 
                />
            </div>
        </BoxContainer>
    );
}