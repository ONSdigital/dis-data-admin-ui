import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SeriesListForm from "./SeriesListForm";

import { useRouter } from "next/navigation";
import { expect } from "@playwright/test";

jest.mock("next/navigation", () => ({ 
    useRouter: jest.fn().mockReturnValue({ 
        push: jest.fn(), 
    }), 
}));

describe("SeriesListForm", () => {
    describe("SeriesListForm renders props correctly", () => {
        it("without props passed", () => {
            render(<SeriesListForm />);

            expect(screen.getByTestId("series-list-search-by-id")).toBeInTheDocument();
            expect(screen.getByTestId("icon-search")).toBeInTheDocument();
            expect(screen.getByTestId("series-list-search-by-id").value).toBe("");
        });

        it("with props passed", () => {
            render(<SeriesListForm datasetID={"foo-bar-dataset-01"}/>);

            expect(screen.getByTestId("series-list-search-by-id")).toBeInTheDocument();
            expect(screen.getByTestId("icon-search")).toBeInTheDocument();
            expect(screen.getByTestId("series-list-search-by-id").value).toBe("foo-bar-dataset-01");
        });
    });

    describe("onClick handler", () => {
        it("is called without id param if input length is 0", () => {     
            render(<SeriesListForm />);

            const button = screen.getByTestId("icon-search");
            fireEvent.click(button)
            expect(useRouter().push.mock.calls).toHaveLength(1);
            expect(useRouter().push.mock.calls[0][0]).toBe("/series")
        });

        it("is called with id param if input length is not 0", () => {     
            render(<SeriesListForm />);

            const input = screen.getByTestId("series-list-search-by-id");
            fireEvent.change(input, {target: {value: "foo-bar-dataset-01"}})

            const button = screen.getByTestId("icon-search");
            fireEvent.click(button)
            expect(useRouter().push.mock.calls).toHaveLength(1);
            expect(useRouter().push.mock.calls[0][0]).toBe("/series?id=foo-bar-dataset-01")
        });
    });
});