import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Topics from "./Topics";

describe("Topics", () => {
    const listOfAllTopics = [
        {
            id: "0001",
            label: "Business, industry and trade",
            subtopics: [
                { id: "1001", label: "Retail sales" },
                { id: "1002", label: "International trade" },
            ],
        },
        {
            id: "0002",
            label: "Census",
            subtopics: [
                { id: "2001", label: "Population estimates" },
            ],
        },
    ];

    test("renders as expected", () => {
        render(
            <Topics
                listOfAllTopics={listOfAllTopics}
                preSelectedTopics={[]}
            />
        );

        expect(screen.getByRole("heading", { name: "Choose a topic" })).toBeInTheDocument();    
        expect(screen.getByTestId("topics-explainer-panel")).toBeInTheDocument();
        const hiddenInput = screen.getByTestId("dataset-series-topics-input")
        expect(hiddenInput).toBeInTheDocument();
        expect(hiddenInput.value).toBe("[]");
        expect(screen.getByTestId("accordion-item-0001")).toHaveTextContent("Business, industry and trade");
        expect(screen.queryByLabelText("Retail sales")).not.toBeInTheDocument();
        expect(screen.getByTestId("accordion-item-0002")).toHaveTextContent("Census");
        expect(screen.queryByLabelText("Population estimates")).not.toBeInTheDocument();
        expect(screen.getByTestId("topics-summary-header-label-topic")).toHaveTextContent("Topic");
        expect(screen.getByTestId("topics-summary-header-label-main-topic")).toHaveTextContent("Main topic");
        expect(screen.getByTestId("topics-summary-no-data")).toHaveTextContent("No topic selected");
    });

    test("renders a preselected topic in the summary and hidden input", () => {
        render(
            <Topics
                listOfAllTopics={listOfAllTopics}
                preSelectedTopics={[{ id: "1001", label: "Retail sales" }]}
            />
        );

        expect(screen.getByRole("heading", { name: "Choose a topic" })).toBeInTheDocument();
        expect(screen.getAllByText("Retail sales")).toHaveLength(2);

        const mainTopicRadio = screen.getByTestId("main-topic-selector-radios-item-1001}-input");
        expect(mainTopicRadio).toBeChecked();

        expect(screen.getByLabelText("Retail sales")).toBeChecked();

        expect(screen.getByDisplayValue('[{"id":"1001","label":"Retail sales"}]')).toBeInTheDocument();
    });

    test("opens a topic accordion item and adds a selected subtopic", async () => {
        const user = userEvent.setup();

        render(<Topics listOfAllTopics={listOfAllTopics} preSelectedTopics={[]} />);

        expect(screen.queryByLabelText("Retail sales")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Business, industry and trade" }));
        await user.click(screen.getByLabelText("Retail sales"));

        expect(screen.getByLabelText("Retail sales")).toBeChecked();
        expect(screen.getByTestId("main-topic-selector-radios-item-1001}-input")).toBeChecked();
        expect(screen.getByDisplayValue('[{"id":"1001","label":"Retail sales"}]')).toBeInTheDocument();
    });

    test("lets the user choose a different main topic while preserving selection order", async () => {
        const user = userEvent.setup();

        render(
            <Topics
                listOfAllTopics={listOfAllTopics}
                preSelectedTopics={[
                    { id: "1001", label: "Retail sales" },
                    { id: "2001", label: "Population estimates" },
                ]}
            />
        );

        const retailRadio = screen.getByTestId("main-topic-selector-radios-item-1001}-input");
        const populationRadio = screen.getByTestId("main-topic-selector-radios-item-2001}-input");

        expect(retailRadio).toBeChecked();
        expect(populationRadio).not.toBeChecked();

        await user.click(populationRadio);

        expect(populationRadio).toBeChecked();
        expect(retailRadio).not.toBeChecked();
        expect(
            screen.getByDisplayValue('[{"id":"2001","label":"Population estimates"},{"id":"1001","label":"Retail sales"}]')
        ).toBeInTheDocument();
    });
});
