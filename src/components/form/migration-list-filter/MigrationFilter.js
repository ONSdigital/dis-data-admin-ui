"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BoxContainer, Checkbox, Button } from "@/components/design-system/DesignSystem";

export default function MigrationFilter({ states }) {
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

    function createCheckboxes() {
        const checkboxOptions = [];
        states.forEach(state => {
            const spaceReplacement = state.replace(/_/g, " ");
            const formattedLabel = spaceReplacement.charAt(0).toUpperCase() + spaceReplacement.slice(1);

            checkboxOptions.push({
                id: "checkbox-" + state,
                name: state,
                dataTestId: "checkbox-" + state,
                label: {
                    text: formattedLabel
                },
                onChange: (e) => { stateFilterOnChange(e.target.value) },
                value: state,
            });
        })
        return ({ itemsList: checkboxOptions });
    }

    const checkboxOptionsItems = createCheckboxes()

    return (
        <>
            <BoxContainer
                borderColor="ons-color-grey-15"
                borderWidth={1}
                classes="ons-grid__col ons-u-pl-no"
                id="box-container"
                title="Filter"
            >
                {states.length > 0 ? (
                    <>
                        <Checkbox
                            id="state-filter"
                            dataTestId="state-filter"
                            items={checkboxOptionsItems}
                            legend="Filter by state"
                            borderless
                            classes="ons-u-mt-m ons-u-mb-m"
                        />
                        <Button
                            dataTestId="migration-filter-apply-button"
                            id="migration-filter-apply-button"
                            text="Apply"
                            variants={["small"]}
                            onClick={filterByState}
                        />
                    </>
                ) : (
                    <p className="ons-u-mt-m ons-u-mb-m">No migration jobs found</p>
                )}
            </BoxContainer>
        </>
    );
}
