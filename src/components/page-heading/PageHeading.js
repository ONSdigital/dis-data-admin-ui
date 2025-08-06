"use client";

import Link from "next/link";
import { Button } from "author-design-system-react";
import { useRouter } from "next/navigation"

const headingStyle = {
    color: "#206095"
};
 
export default function PageHeading(props){
    const router = useRouter()

    return (
        <>
            <h1 data-testid="page-heading-header" className="ons-u-fs-m ons-u-mb-xxs" style={headingStyle}>{props.heading}</h1>
            <h2 data-testid="page-heading-title" className="ons-u-fs-xl ons-u-mb-l">{props.title}</h2>
                <Button
                    dataTestId="page-heading-create-button"
                    text={props.createMessage}
                    onClick={() => router.push(props.linkCreate)}                 
                />     
            <Link data-testid="page-heading-back-link" href={props.linkBack} className="ons-u-fs-s ons-u-dib ons-u-mt-s ons-u-ml-s">{props.backToMessage}</Link>
        </>
  );
}
