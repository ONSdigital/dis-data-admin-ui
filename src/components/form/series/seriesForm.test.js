import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import SeriesForm from './SeriesForm'
import { dataset } from '../../../../tests/mocks/dataset.mjs';

describe("Series Form", () => {
    const listOfTopics = [
        {
            "id": "2945",
            "title": "Business, industry and trade",
        },
        {
            "id": "3161",
            "title": "Census",
        }
    ]
    const mockAction = jest.fn()

    test("Series form renders props correctly", () => {
        render(<SeriesForm currentTitle={dataset.title} currentID={dataset.id} currentDescription={dataset.description} listOfTopics={listOfTopics} action={mockAction}/>);

        const title = screen.getByTestId("dataset-series-title");
        expect(title.value).toBe("Mock Dataset");

        const id = screen.getByTestId("dataset-series-id");
        expect(id.value).toBe("mock-quarterly")

        const description = screen.getByTestId("dataset-series-description");
        expect(description.value).toBe("This is a mock dataset test description")
    })

    it("onChange handler updates text input state", () => {
        render(<SeriesForm currentTitle={dataset.title} currentID={dataset.id} currentDescription={dataset.description} listOfTopics={listOfTopics} action={mockAction}/>);
        
        const title = screen.getByTestId("dataset-series-title");
        fireEvent.change(title, {target: {value: "test name"}});
        expect(title.value).toBe("test name");

        const description = screen.getByTestId("dataset-series-description");
        fireEvent.change(description, {target: {value: "test description"}});
        expect(description.value).toBe("test description");
    });
});
