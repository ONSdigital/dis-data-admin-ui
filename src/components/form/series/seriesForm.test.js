import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import SeriesForm from "./SeriesForm"
import { datasetList } from "../../../../tests/mocks/datasets.mjs";

import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({ 
    useRouter: jest.fn().mockReturnValue({ 
        push: jest.fn(), 
    }), 
}));

describe("Series Form", () => {
    const listOfAllTopics = [
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
    const dataset = datasetList.items[2]

    test("Series form renders correctly", () => {
        render(<SeriesForm listOfAllTopics={listOfAllTopics} action={mockAction}/>);

        expect(screen.getByTestId("dataset-series-id")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-title")).toBeInTheDocument();
        expect(screen.getByTestId("fieldset-dataset-series-topics-checkbox")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-description")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-qmi")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-keywords")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-contact-name")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-contact-email")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-save")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-cancel")).toBeInTheDocument();
    });

    test("Series form renders props correctly", () => {
        render(<SeriesForm currentTitle={dataset.title} currentID={dataset.id} currentDescription={dataset.description} listOfAllTopics={listOfAllTopics} action={mockAction}/>);

        const title = screen.getByTestId("dataset-series-title");
        expect(title.value).toBe("Mock Dataset");

        const id = screen.getByTestId("dataset-series-id");
        expect(id.value).toBe("mock-quarterly")

        const description = screen.getByTestId("dataset-series-description");
        expect(description.value).toBe("This is a mock dataset test description")
    });

    it("onChange handler updates text input state", () => {
        render(<SeriesForm currentTitle={dataset.title} currentID={dataset.id} currentDescription={dataset.description} listOfAllTopics={listOfAllTopics} action={mockAction}/>);
        
        const title = screen.getByTestId("dataset-series-title");
        fireEvent.change(title, {target: {value: "test name"}});
        expect(title.value).toBe("test name");

        const description = screen.getByTestId("dataset-series-description");
        fireEvent.change(description, {target: {value: "test description"}});
        expect(description.value).toBe("test description");
    });
});
