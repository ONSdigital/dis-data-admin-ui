import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import PaginationPOC from "./PaginationDisDataAdmin"

import { usePathname, useSearchParams, useRouter } from "next/navigation";
jest.mock("next/navigation");

useRouter.mockReturnValue({
  push: jest.fn()
})

useSearchParams.mockReturnValue({
    toString: jest.fn()
})

usePathname.mockReturnValue("test.com")

describe("Pagination", () => {
    test("Maps the expected number of pages", () => {

        const totalNumberOfPages = 5
        const currentPage = 3
        const limit = 25

        render(<PaginationPOC totalNumberOfPages={totalNumberOfPages} currentPage={currentPage} limit={limit}/>)

        const pageLinks = screen.getAllByRole("listitem")
        expect(pageLinks.length).toBe(7)
    })
})