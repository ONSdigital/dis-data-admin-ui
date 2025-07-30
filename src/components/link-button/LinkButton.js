'use client';

import { Button } from "author-design-system-react";
import { useRouter } from 'next/navigation'

export default function LinkButton(props){
    const router = useRouter()
    
    return (
        <Button
            text = {props.text}
            onClick={() => router.push(props.link)}            
        />
    )
};
