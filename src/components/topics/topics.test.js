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

        const select = screen.getByTestId('dataset-series-topics-select');
        expect(select).toBeInTheDocument();

        const list = screen.getAllByTestId("dataset-series-topics-list-item")
        expect(list.length).toBe(1)

        const options = screen.getAllByTestId("dataset-series-topics-option")
        expect(options.length).toBe(4)
    })
    
    it("onClick handler gets called", () => {
        const selectedTopics = ['2945']
        const setSelectedTopics = jest.fn()

        render(<Topics listOfAllTopics={listOfAllTopics} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics}/>);

        let list = screen.getAllByTestId("dataset-series-topics-list-item")
        expect(list.length).toBe(1)

        const select = screen.getByTestId('dataset-series-topics-select');
        const button = screen.getByTestId("dataset-series-add-topic-button");
        fireEvent.change(select, { target: { value: 3161 } })

        expect(setSelectedTopics.mock.calls).toHaveLength(0);
        fireEvent.click(button)
        expect(setSelectedTopics).toHaveBeenCalledTimes(1)

        list = screen.getAllByTestId("dataset-series-topics-list-item")
        expect(list.length).toBe(2)
    });

    test("Dropdown list contains the expected titles", () => {
        const selectedTopics = [];
        const setSelectedTopics = jest.fn();
    
        render(<Topics listOfAllTopics={listOfAllTopics} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics}/>);
    
        const options = screen.getAllByTestId("dataset-series-topics-option");
    
        const expectedTitles = [
            "Select an option",
            "Business, industry and trade",
            "Census",
            "Employment and labour market"
        ];
    
        options.forEach((option, index) => {
            expect(option.textContent).toBe(expectedTitles[index]);
        });
    });
})