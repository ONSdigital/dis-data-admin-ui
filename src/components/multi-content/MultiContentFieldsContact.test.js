import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsContact from "./MultiContentFieldsContact";

const item = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    telephone: "+44 1234 567891",
};

const renderContact = (props = {}) => {
    const handleOnChange = props.handleOnChange || jest.fn();
    const handleOnRemove = props.handleOnRemove || jest.fn();
    const view = render(
        <MultiContentFieldsContact
            id="dataset-series-contacts"
            index={0}
            item={item}
            handleOnChange={handleOnChange}
            handleOnRemove={handleOnRemove}
            showRemoveButton={false}
            {...props}
        />
    );
    return { ...view, handleOnChange, handleOnRemove };
};

describe("MultiContentFieldsContact", () => {
    describe("renders", () => {
        it("with the contact values", () => {
            renderContact();

            expect(screen.getByTestId("dataset-series-contacts-name-0")).toHaveValue("Jane Smith");
            expect(screen.getByTestId("dataset-series-contacts-email-0")).toHaveValue("jane.smith@example.com");
            expect(screen.getByTestId("dataset-series-contacts-telephone-0")).toHaveValue("+44 1234 567891");
            expect(document.getElementById("dataset-series-contacts")).toHaveValue(JSON.stringify({
                name: item.name,
                email: item.email,
                telephone: item.telephone,
            }));
            expect(screen.getByText("Clear contact")).toBeInTheDocument();
            expect(screen.queryByText("Remove contact")).not.toBeInTheDocument();
            expect(screen.queryByText("Contact name is required")).not.toBeInTheDocument();
        });

        it("with validation errors on the name and email", () => {
            renderContact({
                errors: {
                    "dataset-series-contacts-name-0": ["Contact name is required"],
                    "dataset-series-contacts-email-0": ["Invalid email address"],
                },
            });

            expect(screen.getByText("Contact name is required")).toBeInTheDocument();
            expect(document.getElementById("dataset-series-contacts-name-0-error")).toBeInTheDocument();
            expect(screen.getByText("Invalid email address")).toBeInTheDocument();
            expect(document.getElementById("dataset-series-contacts-email-0-error")).toBeInTheDocument();
        });

        it("with a contact list error", () => {
            renderContact({
                errors: {
                    contacts: ["Contact is required"],
                },
            });

            expect(screen.getByText("Contact is required")).toBeInTheDocument();
            expect(screen.getByTestId("field-dataset-series-contacts-error")).toBeInTheDocument();
        });
    });

    it("calls handleOnChange with the updated contact", () => {
        const { handleOnChange, rerender } = renderContact();

        fireEvent.change(screen.getByTestId("dataset-series-contacts-name-0"), { target: { value: "Ada Lovelace" } });
        expect(screen.getByTestId("dataset-series-contacts-name-0")).toHaveValue("Jane Smith");
        expect(handleOnChange).toHaveBeenCalledWith({ ...item, name: "Ada Lovelace" });

        const updatedItem = { ...item, name: "Ada Lovelace" };
        rerender(
            <MultiContentFieldsContact
                id="dataset-series-contacts"
                index={0}
                item={updatedItem}
                handleOnChange={handleOnChange}
                handleOnRemove={jest.fn()}
            />
        );
        expect(screen.getByTestId("dataset-series-contacts-name-0")).toHaveValue("Ada Lovelace");
        expect(document.getElementById("dataset-series-contacts")).toHaveValue(JSON.stringify({
            name: updatedItem.name,
            email: updatedItem.email,
            telephone: updatedItem.telephone,
        }));

        fireEvent.change(screen.getByTestId("dataset-series-contacts-email-0"), { target: { value: "ada@example.com" } });
        expect(handleOnChange).toHaveBeenCalledWith({ ...updatedItem, email: "ada@example.com" });

        fireEvent.change(screen.getByTestId("dataset-series-contacts-telephone-0"), { target: { value: "+44 20 7946 0000" } });
        expect(handleOnChange).toHaveBeenCalledWith({ ...updatedItem, telephone: "+44 20 7946 0000" });
    });

    it("calls handleOnChange when the clear link is clicked", () => {
        const handleOnChange = jest.fn();
        const handleOnRemove = jest.fn();
        renderContact({ handleOnChange, handleOnRemove });

        fireEvent.click(screen.getByText("Clear contact"));
        expect(handleOnChange).toHaveBeenCalledWith({ index: 0, name: "", email: "", telephone: "" });
        expect(handleOnRemove).not.toHaveBeenCalled();
    });

    it("calls handleOnRemove when the remove link is clicked", () => {
        const handleOnChange = jest.fn();
        const handleOnRemove = jest.fn();
        renderContact({ showRemoveButton: true, handleOnChange, handleOnRemove });

        fireEvent.click(screen.getByText("Remove contact"));
        expect(handleOnRemove).toHaveBeenCalledTimes(1);
        expect(handleOnChange).not.toHaveBeenCalled();
    });
});
