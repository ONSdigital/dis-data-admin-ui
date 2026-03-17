"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BoxContainer, Checkbox, Button } from "@/components/design-system/DesignSystem";

export default function MigrationFilter() {
    const [stateFilters, setStateFilters] = useState([]);

    const { push } = useRouter();
    const pathname = usePathname();

    const stateFilterOnChange = (state) => {
        if (!stateFilters.includes(state)) {
            setStateFilters([...stateFilters, state]);
        } else {
            setStateFilters(
                stateFilters.filter(s =>
                    s !== state
                )
            );
        }
    };

    const filterByState = () => {
        if (stateFilters.length === 0) {
            push(pathname);
            return;
        }

        const url = `${pathname}?state=${stateFilters.join(",")}`;
        push(url);
    };

    return (
        <>
            <BoxContainer
                borderColor="ons-color-grey-15"
                borderWidth={1}
                classes="ons-grid__col ons-u-pl-no"
                id="box-container"
                title="Filter"
            >
                <Checkbox
                    id="state-filter"
                    dataTestId="state-filter"
                    items={{
                        itemsList: [
                            {
                                id: "approved",
                                name: "approved",
                                label: {
                                    text: "Approved",
                                },
                                onChange: (e) => { stateFilterOnChange(e.target.value) },
                                value: "approved",
                            },
                            {
                                id: "submitted",
                                name: "submitted",
                                label: {
                                    text: "Submitted",
                                },
                                onChange: (e) => { stateFilterOnChange(e.target.value) },

                                value: "submitted",
                            },
                            {
                                id: "in-review",
                                name: "in-review",
                                label: {
                                    text: "In review",
                                },
                                onChange: (e) => { stateFilterOnChange(e.target.value) },

                                value: "in_review",
                            },
                            {
                                id: "reverted",
                                name: "reverted",
                                label: {
                                    text: "Reverted",
                                },
                                onChange: (e) => { stateFilterOnChange(e.target.value) },

                                value: "reverting",
                            }
                        ]
                    }}
                    legend="Filter by state"
                    borderless
                    classes="ons-u-mt-m ons-u-mb-m"
                />
                <Button
                    dataTestId="migration-filter-apply-button"
                    id="migration-filter-apply-button"
                    text="Apply"
                    variants={[
                        "small"
                    ]}
                    onClick={() => { filterByState(); }}
                />
            </BoxContainer>
        </>
    );
}
