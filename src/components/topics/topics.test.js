import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Topics from './Topics'

describe("Topics", () => {
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

        test("Topics renders props correctly", () => {
            const topics = ['2945']
            const setTopics = jest.fn()
    
            render(<Topics listOfTopics={listOfTopics} topics={topics} setTopics={setTopics}/>);
    
            const select = screen.getByTestId('dataset-series-topics-select');
            expect(select).toBeInTheDocument();
    
            const list = screen.getAllByTestId("dataset-series-topics-list-item")
            expect(list.length).toBe(1)

            const options = screen.getAllByTestId("dataset-series-topics-option")
            expect(options.length).toBe(3)
        })
    
        it("onClick handler gets called", () => {
            const topics = ['2945']
            const setTopics = jest.fn()

            render(<Topics listOfTopics={listOfTopics} topics={topics} setTopics={setTopics}/>);

            let list = screen.getAllByTestId("dataset-series-topics-list-item")
            expect(list.length).toBe(1)

            const select = screen.getByTestId('dataset-series-topics-select');
            const button = screen.getByTestId("dataset-series-add-topic-button");
            fireEvent.change(select, { target: { value: 3161 } })

            expect(setTopics.mock.calls).toHaveLength(0);
            fireEvent.click(button)
            expect(setTopics).toHaveBeenCalledTimes(1)

            list = screen.getAllByTestId("dataset-series-topics-list-item")
            expect(list.length).toBe(2)
        });
})