import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import List from './List';

test("List renders props correctly", () => {
    let datasets =  {
        "items": [
            {
                "title": "Test dataset",
                "description": "Something about a test dataset",
                "id": "test-dataset"
            },
            {
                "title": "Consumer prices",
                "description": "Something about consumer prices",
                "id": "cpih"
            },
            {
                "title": "Weekly deaths",
                "description": "Something about weekly deaths",
                "id": "weekly-deaths"
            }
        ]
    }
    render(<List items={datasets.items}/>);

    const element = screen.getByRole('heading', {name: /Test dataset/i});
    expect(element).toBeInTheDocument();

    const list = screen.getAllByRole("heading")
    expect(list.length).toBe(3)

})