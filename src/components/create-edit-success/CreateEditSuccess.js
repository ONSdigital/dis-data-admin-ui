"use client";

import { Panel } from "@/components/design-system/DesignSystem";

export default function CreateEditSuccess({query, message}) {
    if (query?.display_success !== "true") {
        return;
    }

    return (
        <div className="ons-u-mb-l">
            <Panel variant="success" dataTestId="create-edit-success-panel">{message}</Panel>
        </div>
    );
}
