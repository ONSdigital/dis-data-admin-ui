"use client";

import { Button } from "author-design-system-react";
import { useRouter } from "next/navigation";

export default function LinkButton(props){
    const router = useRouter();
    
    return (
        <Button
            dataTestId={props.dataTestId}
            id={props.id}
            text = {props.text}
            variants={props.variants}
            classes={props.classes}
            onClick={() => router.push(props.link)}            
        />
    );
};
