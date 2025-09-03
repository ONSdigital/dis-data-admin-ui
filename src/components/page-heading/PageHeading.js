"use client";

import Link from "next/link";
import { Button, Breadcrumb, Panel } from "author-design-system-react";
import { useRouter } from "next/navigation";

export default function PageHeading(props){
    const router = useRouter();

    const renderBreadcrumb = () => {
        if (props.breadcrumbs) {
            return (
                <Breadcrumb itemsList={props.breadcrumbs} classes="ons-u-mb-xs"/>
            );
        }
    };

    const renderSubtitle = () => {
        if (props.subtitle) {
            return (
                <h2 data-testid="page-heading-subtitle" className="ons-u-fs-m ons-u-mb-xxs" style={{color: "var(--ons-color-branded-text)"}}>{props.subtitle}</h2>
            );
        }
    };

    const renderButton = () => {
        if (props.buttonText && props.buttonURL) {
            return (
                <Button
                    dataTestId="page-heading-create-button"
                    text={props.buttonText}
                    onClick={() => router.push(props.buttonURL)}      
                    variants={props.disableButton ? "disabled" : "primary"}         
                /> 
            );
        }
    };

    const renderPanel = () => {
        if (props.showPanel && props.panelText) {
            return (
                <Panel variant="info" classes="ons-u-mb-l" dataTestId="page-heading-panel"><p>{props.panelText}</p></Panel>
            );
        }
    };

    const renderLink = () => {
        if (props.linkText && props.linkURL) {
            return (
                <Link data-testid="page-heading-link" href={props.linkURL} className="ons-u-fs-s ons-u-dib ons-u-mt-s ons-u-ml-s">{props.linkText}</Link>
            );
        }
    };

    return (
        <>
            { renderBreadcrumb() }
            { renderSubtitle() }
            <h1 data-testid="page-heading-title" className="ons-u-fs-xl ons-u-mb-m">{props.title}</h1>
            { renderPanel() }
            { renderButton() }
            { renderLink() }
        </>
  );
}
