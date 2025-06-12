import "@testing-library/jest-dom"
import { render, screen, within } from "@testing-library/react"
import Pagination from "./Pagination"

import { usePathname, useSearchParams, useRouter } from "next/navigation";
jest.mock("next/navigation");

useRouter.mockReturnValue({
  push: jest.fn()
})

useSearchParams.mockReturnValue(
    ""
)

usePathname.mockReturnValue("test.com")

describe("Pagination", () => {
    test("Maps the expected number of pages", () => {

        const totalNumberOfPages = 5
        const currentPage = 3
        const limit = 25

        render(<Pagination totalNumberOfPages={totalNumberOfPages} currentPage={currentPage} limit={limit}/>)

        const pageLinks = screen.getAllByRole("listitem")
        expect(pageLinks.length).toBe(7)

        const pageOne = screen.getByTestId("pagination-1");
        const pageOneLink = within(pageOne).getByRole("link")
        expect(pageOneLink).toHaveAttribute("href", "test.com?limit=25&offset=0")

        const pageTwo = screen.getByTestId("pagination-2");
        const pageTwoLink = within(pageTwo).getByRole("link")
        expect(pageTwoLink).toHaveAttribute("href", "test.com?limit=25&offset=25")

        const pageFour = screen.getByTestId("pagination-4");
        const pageFourLink = within(pageFour).getByRole("link")
        expect(pageFourLink).toHaveAttribute("href", "test.com?limit=25&offset=75")

        const pageFive = screen.getByTestId("pagination-5");
        const pageFiveLink = within(pageFive).getByRole("link")
        expect(pageFiveLink).toHaveAttribute("href", "test.com?limit=25&offset=100")

    })
})