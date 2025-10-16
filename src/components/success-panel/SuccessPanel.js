"use client";

import { Panel } from "@/components/design-system/DesignSystem";

export default function SuccessPanel({query, message}) {
    if (query?.display_success !== "true") {
        return;
    }

    return (
        <div className="ons-u-mb-l">
            <Panel variant="success" dataTestId="success-panel">{message}</Panel>
        </div>
    );
}
