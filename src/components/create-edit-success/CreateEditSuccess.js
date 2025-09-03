"use client";

import { Panel } from "@/components/design-system/DesignSystem";

export default function CreateEditSuccess({query, message}) {
    if (query?.display_success !== "true") {
        return;
    }

    return (
        <div className="ons-grid__col ons-col-12@m ons-u-mb-xl">
            <Panel variant="success" dataTestId="create-edit-success-panel">{message}</Panel>
        </div>
    );
}
