import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Topics from './Topics'

describe("Topics", () => {
    const listOfAllTopics = [
        {
            "id": "2945",
            "current": {
                "id": "2945",
                "title": "Business, industry and trade",
            }
        },
        {
            "id": "3161",
            "next": {
                "id": "3161",
                "title": "Census",
            }
        },
        {
            "id": "5687",
            "title": "Employment and labour market",
        }
    ]

    test("Topics renders props correctly", () => {
        const selectedTopics = ['2945']
        const setSelectedTopics = jest.fn()

        render(<Topics listOfAllTopics={listOfAllTopics} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics}/>);

        const checkboxes = screen.getByTestId('fieldset-dataset-series-topics-checkbox');
        expect(checkboxes).toBeInTheDocument();

        const checkbox = screen.getByTestId("dataset-series-topics-checkbox-item-business-industry-and-trade-input")
        expect(checkbox).toBeChecked()

        const options = screen.getAllByRole('checkbox')
        expect(options.length).toBe(3)
    })
    
    it("onClick handler gets called", () => {
        const selectedTopics = ['2945']
        const setSelectedTopics = jest.fn()

        render(<Topics listOfAllTopics={listOfAllTopics} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics}/>);

        const checkbox = screen.getByTestId("dataset-series-topics-checkbox-item-business-industry-and-trade-input")
        expect(checkbox).toBeChecked()

        expect(setSelectedTopics.mock.calls).toHaveLength(0);
        const button = screen.getByTestId("dataset-series-clear-topic-selection-button");
        fireEvent.click(button)
        expect(setSelectedTopics).toHaveBeenCalledTimes(1)

        expect(checkbox).not.toBeChecked()
    });
})
