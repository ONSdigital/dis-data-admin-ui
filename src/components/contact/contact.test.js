import "@testing-library/jest-dom"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Contact from "./Contact"

describe("Contact", () => {
    let contacts = [
        {
            "name": "Test Name",
            "email": "test@email.com",
            "telephone": "+44 1234 567891",
        },
        {
            "name": "Test Name Two",
            "email": "test.two@email.com",
            "telephone": "+44 1234 567892",
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

        const contactTelephone = screen.getByTestId("dataset-series-contact-telephone");
        expect(contactTelephone).toBeInTheDocument();

        const headingTwo = screen.getByRole("heading", { level: 3, name: /Contacts/i });
        expect(headingTwo).toBeInTheDocument();

        const list = screen.getAllByRole("listitem");
        expect(list.length).toBe(2);
        expect(screen.getByText("Test Name")).toBeInTheDocument();
        expect(screen.getByText("test@email.com")).toBeInTheDocument();
        expect(screen.getByText("+44 1234 567891")).toBeInTheDocument();
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

        const contactEmail = screen.getByTestId("dataset-series-contact-email");
        fireEvent.change(contactEmail, { target: { value: "test@email.com" } });
        expect(contactEmail.value).toBe("test@email.com");

        const contactTelephone = screen.getByTestId("dataset-series-contact-telephone");
        fireEvent.change(contactTelephone, { target: { value: "+44 1234 567891" } });
        expect(contactTelephone.value).toBe("+44 1234 567891");
    });

    it("Add contact onClick handler gets called", () => {
        render(<Contact contactsList={[]} />);

        expect(screen.queryByTestId("contact-item-0")).not.toBeInTheDocument();
        const contactName = screen.getByTestId("dataset-series-contact-name");
        const contactEmail = screen.getByTestId("dataset-series-contact-email");
        const contactTelephone = screen.getByTestId("dataset-series-contact-telephone");
        const button = screen.getByTestId("dataset-series-add-contact-button");

        fireEvent.change(contactName, { target: { value: "test name" } });
        fireEvent.change(contactEmail, { target: { value: "test@email.com" } });
        fireEvent.change(contactTelephone, { target: { value: "+44 1234 567891" } });
        fireEvent.click(button);

        expect(screen.getByTestId("contact-item-0")).toBeInTheDocument();
        expect(screen.getByText("test name")).toBeInTheDocument();
        expect(screen.getByText("test@email.com")).toBeInTheDocument();
        expect(screen.getByText("+44 1234 567891")).toBeInTheDocument();
        expect(contactName.value).toBe("");
        expect(contactEmail.value).toBe("");
        expect(contactTelephone.value).toBe("");
    });

    it("Add contact shows validation errors when fields are empty", () => {
        render(<Contact contactsList={[]} />);

        const button = screen.getByTestId("dataset-series-add-contact-button");
        fireEvent.click(button);

        expect(screen.getByText("Name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Number is required")).toBeInTheDocument();
        expect(screen.queryByTestId("contact-item-0")).not.toBeInTheDocument();
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
        expect(screen.queryByText("Test Name")).not.toBeInTheDocument();
        expect(screen.getByText("Test Name Two")).toBeInTheDocument();
    });
});
