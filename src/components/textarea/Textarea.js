import { Field, Label, sanitiseString } from "author-design-system-react"

export default function TextArea(props) {

    const sanitisedId = sanitiseString(props.id);
    const sanitisedDataTestId = sanitiseString(props.dataTestId);

    const renderTextArea = () => {
        return (
            <>
                <Label
                for={sanitisedId}
                id={props.label.id}
                text={props.label.text}
                classes={props.label.classes}
                description={props.label.description}
                attributes={props.label.attributes}
                accessiblePlaceholder={props.accessiblePlaceholder}
                dataTestId={sanitisedDataTestId}
                />
                <textarea id={props.id} className="ons-input ons-input--textarea" name={props.name} value={props.value} rows="5" onChange={props.onChange}></textarea>
            </>
        )
    }

    return (
        <Field
        id={props.fieldId}
        classes={props.fieldClasses}
        dontWrap={props.dontWrap}
        dataTestId={`field-${sanitisedDataTestId}`}
        inline={props.label?.inline}
        error={props.error}
        >
        {renderTextArea()}
        </Field>
    )
};
