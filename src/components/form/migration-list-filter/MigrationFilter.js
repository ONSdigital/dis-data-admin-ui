"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BoxContainer, Checkbox, Button } from "@/components/design-system/DesignSystem";

export default function MigrationFilter({ states = []}) {
    const searchParams = useSearchParams();
    const [stateFilters, setStateFilters] = useState(() => {
        const state = searchParams.get("state");
        return state ? state.split(",") : [];
    });

    const { push } = useRouter();
    const pathname = usePathname();

    const stateFilterOnChange = (state) => {
        setStateFilters((prev) =>
            prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
        );
    };

    const handleFilterButtonPress = () => {
        if (stateFilters.length === 0) {
            push(pathname);
            return;
        }

        const url = `${pathname}?state=${stateFilters.join(",")}`;
        push(url);
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
            title="Filter results"
        >
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
        </BoxContainer>
    );
}
