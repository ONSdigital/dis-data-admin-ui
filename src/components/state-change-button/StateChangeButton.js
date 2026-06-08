"use client";

import { Button } from "@/components/design-system/DesignSystem";

export default function StateChangeButton(props) {
    return (
        <Button
            dataTestId={props.dataTestId}
            id={props.id}
            text={props.text}
            iconType={props.iconType}
            iconPosition={props.iconPosition}
            variants={props.variants}
            classes={props.classes}
            onClick={() => props.onClick(props.jobID, props.jobState, props.series)}
        />
    );
}
