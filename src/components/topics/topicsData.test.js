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
                    { id: "sub-1", label: "Retail", subtopics: null },
                    { id: "sub-2", label: "Manufacturing", subtopics: null },
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
});
