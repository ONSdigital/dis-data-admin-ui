'use client'

import { Panel } from "author-design-system-react";

export default function ErrorPanel() {
    return (
        <>
            <Panel title="Error" variant="error">
                <p>
                    There was an issue retrieving the list of datasets
                </p>
            </Panel>
        </>
    );
}