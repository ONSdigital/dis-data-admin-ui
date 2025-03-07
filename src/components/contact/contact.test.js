import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Contact from './Contact'

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