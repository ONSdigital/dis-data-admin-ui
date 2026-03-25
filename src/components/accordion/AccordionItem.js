import { useState } from "react";

import { sanitiseString } from "author-design-system-react";

export default function AccordionItem({ accordionItem }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOnClick = () => {
        setIsOpen(!isOpen);
    };

    const sanitisedId = sanitiseString(`accordion-item-${accordionItem.id}`);
    const sanitisedDataTestId = sanitiseString(`accordion-item-${accordionItem.id}`);

    return (
        <div id={sanitisedId} className="ons-details ons-details--accordion" data-group="accordion-example" key={accordionItem.id} data-testid={sanitisedDataTestId}>
            <div className="ons-details__heading" role="button" onClick={handleOnClick}>
                <h2 className="ons-details__title ons-u-fs-r--b"><a>{accordionItem.label}</a></h2>
                <span className="ons-details__icon">
                    <svg className="ons-icon" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg" focusable="false"
                        fill="currentColor" role="img" aria-hidden="true">
                        <path
                            d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
                            transform="translate(-5.02 -1.59)" />
                    </svg></span>
            </div>
            { isOpen &&
                <div id={`${sanitisedId}-content`} className="ons-details__content" data-testid={`${sanitisedDataTestId}-content`}>
                    {accordionItem?.body || <p>No contents to show</p>}
                </div>
            }       
        </div>
    )
};
