import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import PublishForm from "./PublishForm";
import { datasetList } from "../../../../tests/mocks/datasets.mjs";

jest.mock("next/navigation", () => ({ 
    useRouter: jest.fn().mockReturnValue({ 
        push: jest.fn(), 
    }), 
}));

describe("Publish form", () => {
    test("renders correctly", () => {
        render(<PublishForm dataset={ datasetList.items[0] } cancelLink={"./"}  />);

        expect(screen.getByText(/Are you sure you want to publish "Consumer prices"?/i)).toBeInTheDocument();
        expect(screen.getByText(/Approving this action will make the dataset series visible to the public./i)).toBeInTheDocument();
        expect(screen.getByTestId("hidden-dataset")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-publish-button")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-publish-cancel-link")).toBeInTheDocument();
    });
});
