jest.mock("@/utils/request/request");

import { getAllTopics } from "./topicsData";
import { httpGet } from "@/utils/request/request";

describe("getAllTopics", () => {
    const reqCfg = { token: "test" };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns an empty array when the topics response is not ok", async () => {
        httpGet.mockResolvedValueOnce({ ok: false, items: [{ id: "1" }] });

        const result = await getAllTopics(reqCfg);

        expect(result).toEqual([]);
        expect(httpGet).toHaveBeenCalledTimes(1);
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics");
    });

    it("returns an empty array when topics items is empty", async () => {
        httpGet.mockResolvedValueOnce({ items: [] });

        const result = await getAllTopics(reqCfg);

        expect(result).toEqual([]);
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics");
    });

    it("maps topics and nested subtopics from linked endpoints", async () => {
        const subtopicsHref = "https://api.example.com/v1/topics/2945/subtopics";

        httpGet.mockResolvedValueOnce({
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
        });
        httpGet.mockResolvedValueOnce({
            items: [
                { id: "sub-1", title: "Retail" },
                { id: "sub-2", title: "Manufacturing" },
            ],
        });

        const result = await getAllTopics(reqCfg);

        expect(result).toEqual([
            {
                id: "2945",
                label: "Business",
                subtopics: [
                    { id: "sub-1", label: "Retail" },
                    { id: "sub-2", label: "Manufacturing" },
                ],
            },
        ]);
        expect(httpGet).toHaveBeenCalledTimes(2);
        expect(httpGet).toHaveBeenNthCalledWith(1, reqCfg, "/topics");
        expect(httpGet).toHaveBeenNthCalledWith(2, reqCfg, "/topics/2945/subtopics");
    });

    it("uses an empty subtopics array when the subtopics response has no items", async () => {
        const subtopicsHref = "https://api.example.com/v1/topics/1/subtopics";

        httpGet.mockResolvedValueOnce({
            items: [
                {
                    id: "1",
                    title: "Topic",
                    slug: "economy",
                    links: { subtopics: { href: subtopicsHref } },
                },
            ],
        });
        httpGet.mockResolvedValueOnce({ items: [] });

        const result = await getAllTopics(reqCfg);

        expect(result).toEqual([
            {
                id: "1",
                label: "Topic",
                subtopics: [],
            },
        ]);
    });

    it("resolves nested subtopics recursively", async () => {
        httpGet.mockResolvedValueOnce({
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
        });
        httpGet.mockResolvedValueOnce({
            items: [
                {
                    id: "2",
                    title: "Subtopic",
                    links: {
                        subtopics: { href: "https://api.example.com/v1/topics/2/subtopics" },
                    },
                },
            ],
        });
        httpGet.mockResolvedValueOnce({
            items: [{ id: "3", title: "Nested subtopic" }],
        });

        const result = await getAllTopics(reqCfg);

        expect(result).toEqual([
            {
                id: "1",
                label: "Topic",
                subtopics: [
                    {
                        id: "2",
                        label: "Subtopic",
                    },
                    { id: "3", label: "Nested subtopic" },
                ],
            },
        ]);
        expect(httpGet).toHaveBeenCalledTimes(3);
        expect(httpGet).toHaveBeenNthCalledWith(1, reqCfg, "/topics");
        expect(httpGet).toHaveBeenNthCalledWith(2, reqCfg, "/topics/1/subtopics");
        expect(httpGet).toHaveBeenNthCalledWith(3, reqCfg, "/topics/2/subtopics");
    });

    it("omits parent subtopic when it has subtopics metadata and flattens children", async () => {
        httpGet.mockResolvedValueOnce({
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
        });
        httpGet.mockResolvedValueOnce({
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
        });
        httpGet.mockResolvedValueOnce({
            items: [{ id: "3", title: "Nested subtopic" }],
        });

        const result = await getAllTopics(reqCfg);

        expect(result).toEqual([
            {
                id: "1",
                label: "Topic",
                subtopics: [{ id: "3", label: "Nested subtopic" }],
            },
        ]);
        expect(httpGet).toHaveBeenCalledTimes(3);
        expect(httpGet).toHaveBeenNthCalledWith(1, reqCfg, "/topics");
        expect(httpGet).toHaveBeenNthCalledWith(2, reqCfg, "/topics/1/subtopics");
        expect(httpGet).toHaveBeenNthCalledWith(3, reqCfg, "/topics/2/subtopics");
    });

    it("includes only topics whose slug matches include list and does not fetch subtopics for excluded slugs", async () => {
        const includedSubtopicsHref = "https://api.example.com/v1/topics/2945/subtopics";

        httpGet.mockResolvedValueOnce({
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
        });
        httpGet.mockResolvedValueOnce({
            items: [{ id: "sub-1", title: "Retail" }],
        });

        const result = await getAllTopics(reqCfg);

        expect(result).toEqual([
            {
                id: "2945",
                label: "Business",
                subtopics: [{ id: "sub-1", label: "Retail" }],
            },
        ]);
        expect(httpGet).toHaveBeenCalledTimes(2);
        expect(httpGet).toHaveBeenNthCalledWith(1, reqCfg, "/topics");
        expect(httpGet).toHaveBeenNthCalledWith(2, reqCfg, "/topics/2945/subtopics");
    });
});
