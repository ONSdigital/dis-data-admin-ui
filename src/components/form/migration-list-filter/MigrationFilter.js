"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BoxContainer, Checkbox, Button, TextInput } from "@/components/design-system/DesignSystem";

export default function MigrationFilter({ states = [], selectedStates = [], label = "" }) {
    const [stateFilters, setStateFilters] = useState(selectedStates);
    const [nameFilter, setNameFilter] = useState(label);

    const { push } = useRouter();
    const pathname = usePathname();

    const stateFilterOnChange = (state) => {
        setStateFilters((prev) =>
            prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
        );
    };

    const handleFilterButtonPress = () => {
        const filters = {
            state: stateFilters.join(","),
            label: nameFilter.trim(),
        };

        const params = new URLSearchParams(
            Object.entries(filters).filter(([, value]) => value)
        );

        const query = params.toString();
        push(query ? `${pathname}?${query}` : pathname);
    };

    const createCheckboxes = () => {
        const checkboxOptions = [];
        if ((!states.length)) {
            return checkboxOptions;
        }
        states.forEach(state => {
            if (state.count > 0) {
                checkboxOptions.push({
                    id: "checkbox-" + state.id,
                    name: state.id,
                    dataTestId: "migration-filter-list-checkbox-" + state.id,
                    label: { text: `${state.label} (${state.count})` },
                    checked: stateFilters.includes(state.id),
                    onChange: (e) => { stateFilterOnChange(e.target.value); },
                    value: state.id,
                });
            }
        });
        return checkboxOptions;
    };

    return (
        <BoxContainer
            borderColor="ons-color-grey-15"
            borderWidth={1}
            classes="ons-grid__col ons-u-pl-no"
            id="box-container"
            title="Search and filter results"
        >
            <form id="migration-list-filter-form" data-testid="migration-list-filter-form">
                <div className="ons-u-mt-s">
                    <TextInput id="migration-list-search-by-name" 
                        dataTestId="migration-list-search-by-name" 
                        label={{text: "Search by name", description: "E.g \"Labour market\""}}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        classes="ons-input--w-20"
                    />
                </div>
                <Checkbox
                    id="state-filter"
                    dataTestId="state-filter"
                    items={{ itemsList: createCheckboxes() }}
                    legend="State"
                    borderless
                    classes="ons-u-mt-m ons-u-mb-m"
                />
                <Button
                    dataTestId="migration-filter-apply-button"
                    id="migration-filter-apply-button"
                    text="Apply"
                    variants={["small"]}
                    onClick={handleFilterButtonPress}
                />
            </form>
        </BoxContainer>
    );
}
