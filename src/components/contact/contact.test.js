import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Contact from './Contact'

describe("Contact", () => {
    test("Contact renders props correctly", () => {
        let contacts =  
        [
            {
                "name": "Test Name",
                "emails": "test@email.com",
            },
            {
                "name": "Test Name Two",
                "emails": "testTwo@email.com",
            }
        ]

        let setContacts = jest.fn()

        let contactsError = ''

        render(<Contact contacts={contacts} setContacts={setContacts} contactsError={contactsError}/>);

        const element = screen.getByRole('heading', {name: /Contacts/i});
        expect(element).toBeInTheDocument();

        const list = screen.getAllByRole("listitem")
        expect(list.length).toBe(2)

    })

    it("onChange handler updates text input state", () => {
        render(<Contact/>);
        const contactName = screen.getByTestId("dataset-series-contact-name");
        fireEvent.change(contactName, {target: {value: "test name"}});
        expect(contactName.value).toBe("test name");
    });

    it("onClick handler gets called", () => {     
        const handleClick = jest.fn();
        expect(handleClick.mock.calls).toHaveLength(0);

        render(<Contact  contacts={[]} setContacts={handleClick}/>);

        const contactName = screen.getByTestId("dataset-series-contact-name");
        const contactEmail = screen.getByTestId("dataset-series-contact-email")
        const button = screen.getByTestId("dataset-series-add-contact-button");

        fireEvent.change(contactName, {target: {value: "test name"}});
        fireEvent.change(contactEmail, {target: {value: "testemail@test.com"}});
        fireEvent.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    });

});
