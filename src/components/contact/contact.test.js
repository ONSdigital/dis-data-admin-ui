import "@testing-library/jest-dom"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Contact from "./Contact"

describe("Contact", () => {
    let contacts = [
        {
            "name": "Test Name",
            "email": "test@email.com",
        },
        {
            "name": "Test Name Two",
            "email": "test.two@email.com",
        }
    ];

    test("Contact renders props correctly", () => {
        let contactsError = "";

        render(<Contact contactsList={contacts} contactsError={contactsError} />);

        const heading = screen.getByRole("heading", { level: 2, name: /Add Contacts/i });
        expect(heading).toBeInTheDocument();

        const contactName = screen.getByTestId("dataset-series-contact-name");
        expect(contactName).toBeInTheDocument();

        const contactEmail = screen.getByTestId("dataset-series-contact-email");
        expect(contactEmail).toBeInTheDocument();

        const headingTwo = screen.getByRole("heading", { level: 3, name: /Contacts/i });
        expect(headingTwo).toBeInTheDocument();

        const list = screen.getAllByRole("listitem");
        expect(list.length).toBe(2);
    });

    test("Contact renders errors correctly", () => {
        render(<Contact contactsList={[]} contactsError={"Test error"} />);

        const heading = screen.getByRole("heading", { level: 2, name: /Add Contacts/i });
        expect(heading).toBeInTheDocument();
        expect(screen.getByTestId("field-dataset-series-contacts-error")).toBeInTheDocument();
        expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    it("onChange handler updates text input state", () => {
        render(<Contact />);
        const contactName = screen.getByTestId("dataset-series-contact-name");
        fireEvent.change(contactName, { target: { value: "test name" } });
        expect(contactName.value).toBe("test name");
    });

    it("Add contact onClick handler gets called", () => {
        render(<Contact contactsList={[]} />);

        expect(screen.queryByTestId("contact-item-test@email.com")).not.toBeInTheDocument();
        const contactName = screen.getByTestId("dataset-series-contact-name");
        const contactEmail = screen.getByTestId("dataset-series-contact-email");
        const button = screen.getByTestId("dataset-series-add-contact-button");

        fireEvent.change(contactName, { target: { value: "test name" } });
        fireEvent.change(contactEmail, { target: { value: "test@email.com" } });
        fireEvent.click(button);

        expect(screen.getByTestId("contact-item-0")).toBeInTheDocument();
    });

    it("Remove contact onClick handler gets called", async () => {
        render(<Contact contactsList={contacts} />);

        const listBefore = screen.getAllByRole("listitem")
        expect(listBefore.length).toBe(2)

        const removeContact = screen.getByTestId("dataset-remove-contact-0");
        fireEvent.click(removeContact);

        await waitFor(() => {
            const listAfter = screen.getAllByRole("listitem")
            expect(listAfter.length).toBe(1)
        });
    });
});
