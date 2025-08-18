"use client";

import { Button } from "author-design-system-react";
import { useRouter } from "next/navigation";

export default function LinkButton(props){
    const router = useRouter()
    
    return (
        <Button
            id="link-button"
            dataTestId="link-button"
            text = {props.text}
            onClick={() => router.push(props.link)}            
        />
    )
};
