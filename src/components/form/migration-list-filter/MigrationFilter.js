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
        if (!(states.length > 0)) {
            return checkboxOptions;
        }
        states.forEach(state => {
            if (state.count > 0) {
                checkboxOptions.push({
                    id: "checkbox-" + state.id,
                    name: state.id,
                    dataTestId: "checkbox-" + state.id,
                    label: { text: state.label },
                    onChange: (e) => { stateFilterOnChange(e.target.value); },
                    value: state.id,
                });
            }
        });
        return checkboxOptions;
    }

    return (
        <>
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
        </>
    );
}
