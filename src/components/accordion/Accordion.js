import { sanitiseString } from "author-design-system-react";
import AccordionItem from "./AccordionItem";

export default function Accordion({ id, dataTestId, accordionItems }) {
    const sanitisedId = sanitiseString(id);
    const sanitisedDataTestId = sanitiseString(dataTestId);

    if (!accordionItems || accordionItems.length === 0) {
        console.warn("No 'accordionItems' props passed. Nothing to render.");
        return;
    }

    return (
        <div id={sanitisedId} className="ons-accordion ons-u-mt-l" data-testid={sanitisedDataTestId}>
            {accordionItems.map((item, index) => <AccordionItem accordionItem={item} key={`accordion-item-${index}`} />)}
        </div>
    );
};
