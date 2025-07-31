'use client';

import Link from 'next/link';
import { Button } from 'author-design-system-react';
import { useRouter } from 'next/navigation'

const headingStyle = {
    color: "#206095"
};
 
export default function PageHeading(props){
    const router = useRouter()

    return (
        <>
            <h1 className="ons-u-fs-m ons-u-mb-xxs" style={headingStyle}>Series</h1>
            <h2 className="ons-u-fs-xl ons-u-mb-l">{props.title}</h2>
                <Button
                    text={props.createMessage}
                    onClick={() => router.push(props.linkCreate)}                 
                />     
            <Link href={props.linkBack} className="ons-u-fs-s ons-u-dib ons-u-mt-s ons-u-ml-s">{props.backToMessage}</Link>
        </>
  );
}
