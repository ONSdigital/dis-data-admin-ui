import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import MultiContentFieldsInput from './MultiContentFieldsInput';

describe("MultiContentItems", () => {
    it("renders correctly when type=input", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1}/>);
        const input = screen.getByTestId("multi-content-test-input-1");
        expect(input).toBeInTheDocument();

        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        expect(textarea).toBeInTheDocument();

    });

    it("onChange handler updates input state", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1}/>);
        const input = screen.getByTestId("multi-content-test-input-1");
        fireEvent.change(input, {target: {value: "test value"}});
        expect(input.value).toBe("test value");
    });

    it("onChange handler updates text area state", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1}/>);
        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        fireEvent.change(textarea, {target: {value: "test value"}});
        expect(textarea.value).toBe("test value");
    });
});