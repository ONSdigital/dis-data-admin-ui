jest.mock("@/utils/request/api-clients/topics", () => ({
    getTopics: jest.fn(),
    getSubTopics: jest.fn(),
}));

import { getAllTopics } from "./topicsData";
import { getTopics, getSubTopics } from "@/utils/request/api-clients/topics";

describe("getAllTopics", () => {
    const accessToken = { token: "test" };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns an empty array when the topics response has an error", async () => {
        getTopics.mockResolvedValueOnce({ error: true, response: { items: [{ id: "1" }] } });

        const result = await getAllTopics(accessToken);

        expect(result).toEqual([]);
        expect(getTopics).toHaveBeenCalledTimes(1);
        expect(getTopics).toHaveBeenCalledWith(accessToken);
    });

    it("returns an empty array when topics items is empty", async () => {
        getTopics.mockResolvedValueOnce({ response: { items: [] } });

        const result = await getAllTopics(accessToken);

        expect(result).toEqual([]);
        expect(getTopics).toHaveBeenCalledWith(accessToken);
    });

    it("maps topics and nested subtopics from linked endpoints alphabetically", async () => {
        const subtopicsHref = "https://api.example.com/v1/topics/2945/subtopics";

        getTopics.mockResolvedValueOnce({
            response: {
                items: [
                    {
                        id: "2945",
                        title: "Business",
                        slug: "businessindustryandtrade",
                        links: {
                            subtopics: { href: subtopicsHref },
                        },
                    },
                ],
            },
        });
        getSubTopics.mockResolvedValueOnce({
            response: {
                items: [
                    { id: "sub-1", title: "Retail" },
                    { id: "sub-2", title: "Manufacturing" },
                ],
            },
        });

        const result = await getAllTopics(accessToken);

        expect(result).toEqual([
            {
                id: "2945",
                label: "Business",
                subtopics: [
                    { id: "sub-2", label: "Manufacturing" },
                    { id: "sub-1", label: "Retail" },
                ],
            },
        ]);
        expect(getTopics).toHaveBeenCalledTimes(1);
        expect(getTopics).toHaveBeenCalledWith(accessToken);
        expect(getSubTopics).toHaveBeenCalledTimes(1);
        expect(getSubTopics).toHaveBeenCalledWith("2945", accessToken);
    });

    it("uses an empty subtopics array when the subtopics response has no items", async () => {
        const subtopicsHref = "https://api.example.com/v1/topics/1/subtopics";

        getTopics.mockResolvedValueOnce({
            response: {
                items: [
                    {
                        id: "1",
                        title: "Topic",
                        slug: "economy",
                        links: { subtopics: { href: subtopicsHref } },
                    },
                ],
            },
        });
        getSubTopics.mockResolvedValueOnce({ response: { items: [] } });

        const result = await getAllTopics(accessToken);

        expect(result).toEqual([
            {
                id: "1",
                label: "Topic",
                subtopics: [],
            },
        ]);
    });

    it("resolves nested subtopics recursively and alphabetically", async () => {
        getTopics.mockResolvedValueOnce({
            response: {
                items: [
                    {
                        id: "1",
                        title: "Topic",
                        slug: "economy",
                        links: {
                            subtopics: { href: "https://api.example.com/v1/topics/1/subtopics" },
                        },
                    },
                ],
            },
        });
        getSubTopics.mockResolvedValueOnce({
            response: {
                items: [
                    {
                        id: "2",
                        title: "Subtopic",
                        links: {
                            subtopics: { href: "https://api.example.com/v1/topics/2/subtopics" },
                        },
                    },
                ],
            },
        });
        getSubTopics.mockResolvedValueOnce({
            response: {
                items: [{ id: "3", title: "Nested subtopic" }],
            },
        });

        const result = await getAllTopics(accessToken);

        expect(result).toEqual([
            {
                id: "1",
                label: "Topic",
                subtopics: [
                    { id: "3", label: "Nested subtopic" },
                    {
                        id: "2",
                        label: "Subtopic",
                    }
                ],
            },
        ]);
        expect(getTopics).toHaveBeenCalledTimes(1);
        expect(getSubTopics).toHaveBeenCalledTimes(2);
        expect(getSubTopics).toHaveBeenNthCalledWith(1, "1", accessToken);
        expect(getSubTopics).toHaveBeenNthCalledWith(2, "1", accessToken);
    });

    it("omits parent subtopic when it has subtopics metadata and flattens children", async () => {
        getTopics.mockResolvedValueOnce({
            response: {
                items: [
                    {
                        id: "1",
                        title: "Topic",
                        slug: "economy",
                        links: {
                            subtopics: { href: "https://api.example.com/v1/topics/1/subtopics" },
                        },
                    },
                ],
            },
        });
        getSubTopics.mockResolvedValueOnce({
            response: {
                items: [
                    {
                        id: "2",
                        title: "Wrapper subtopic",
                        subtopics_ids: ["3"],
                        links: {
                            subtopics: { href: "https://api.example.com/v1/topics/2/subtopics" },
                        },
                    },
                ],
            },
        });
        getSubTopics.mockResolvedValueOnce({
            response: {
                items: [{ id: "3", title: "Nested subtopic" }],
            },
        });

        const result = await getAllTopics(accessToken);

        expect(result).toEqual([
            {
                id: "1",
                label: "Topic",
                subtopics: [{ id: "3", label: "Nested subtopic" }],
            },
        ]);
        expect(getTopics).toHaveBeenCalledTimes(1);
        expect(getSubTopics).toHaveBeenCalledTimes(2);
        expect(getSubTopics).toHaveBeenNthCalledWith(1, "1", accessToken);
        expect(getSubTopics).toHaveBeenNthCalledWith(2, "1", accessToken);
    });

    it("includes only topics whose slug matches include list and does not fetch subtopics for excluded slugs", async () => {
        const includedSubtopicsHref = "https://api.example.com/v1/topics/2945/subtopics";

        getTopics.mockResolvedValueOnce({
            response: {
                items: [
                    {
                        id: "5829",
                        title: "About us",
                        slug: "aboutus",
                        links: {
                            subtopics: {
                                href: "https://api.example.com/v1/topics/5829/subtopics",
                            },
                        },
                    },
                    {
                        id: "2945",
                        title: "Business",
                        slug: "businessindustryandtrade",
                        links: { subtopics: { href: includedSubtopicsHref } },
                    },
                ],
            },
        });
        getSubTopics.mockResolvedValueOnce({
            response: {
                items: [{ id: "sub-1", title: "Retail" }],
            },
        });

        const result = await getAllTopics(accessToken);

        expect(result).toEqual([
            {
                id: "2945",
                label: "Business",
                subtopics: [{ id: "sub-1", label: "Retail" }],
            },
        ]);
        expect(getTopics).toHaveBeenCalledTimes(1);
        expect(getSubTopics).toHaveBeenCalledTimes(1);
        expect(getTopics).toHaveBeenCalledWith(accessToken);
        expect(getSubTopics).toHaveBeenCalledWith("2945", accessToken);
    });
});
