import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import TextArea from './Textarea';

describe("Textbox", () => {
    const textareaID = "test-text-area-1";

    it("renders correctly", () => {
        render(<TextArea id={textareaID} dataTestId={textareaID} name={textareaID} label={{text: "Test label", description: "Test description"}} key={textareaID}/>);
        const label = screen.getByTestId(`${textareaID}-label`);
        expect(label).toBeInTheDocument();

    
        const description = screen.getByTestId(`${textareaID}-description`);
        expect(description).toBeInTheDocument();
    
        const textarea = screen.getByTestId(textareaID);
        expect(textarea).toBeInTheDocument();
    });

    it("renders errors correctly", () => {
        render(<TextArea id={textareaID} dataTestId={textareaID} name={textareaID} key={textareaID} error={{text:"Test error", id:"test-error-1"}} />);
        const error = screen.getByTestId(`field-${textareaID}-error`);
        expect(error).toBeInTheDocument();
    });
});