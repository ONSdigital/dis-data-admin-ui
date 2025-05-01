import { convertTopicIDsToTopicTitles, getTopicTitle } from "./topics";
import { httpGet } from "../../utils/request/request";
import { logError } from "../log/log";

jest.mock("../../utils/request/request");
jest.mock("../log/log");

describe("convertTopicIDsToTopicTitles", () => {
    const reqCfg = null;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return null if topicIDs is null", async () => {
        const result = await convertTopicIDsToTopicTitles(null, reqCfg);
        expect(result).toEqual(null);
    });

    it("should return null if topicIDs is an empty array", async () => {
        const result = await convertTopicIDsToTopicTitles([], reqCfg);
        expect(result).toEqual(null);
    });

    it("should return topic titles for valid topicIDs", async () => {
        httpGet.mockResolvedValueOnce({ title: "Topic 1" });
        httpGet.mockResolvedValueOnce({ title: "Topic 2" });

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], reqCfg);

        expect(result).toEqual(["Topic 1", "Topic 2"]);
        expect(httpGet).toHaveBeenCalledTimes(2);
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics/id1");
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics/id2");
    });

    it("should return fallback title if a topic title is missing", async () => {
        httpGet.mockResolvedValueOnce({});
        httpGet.mockResolvedValueOnce({ title: "Topic 2" });

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], reqCfg);

        expect(result).toEqual(["id1 - unable to find topic title", "Topic 2"]);
    });

    it("should log an error and return fallback title if an API call fails", async () => {
        httpGet.mockRejectedValueOnce(new Error("API error"));
        httpGet.mockResolvedValueOnce({ title: "Topic 2" });

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], reqCfg);

        expect(result).toEqual(["id1 - unable to find topic title", "Topic 2"]);
        expect(logError).toHaveBeenCalledWith("error fetching topic", "id1", null, expect.any(Error));
    });

    it("should handle multiple API call failures", async () => {
        httpGet.mockRejectedValueOnce(new Error("API error 1"));
        httpGet.mockRejectedValueOnce(new Error("API error 2"));

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], reqCfg);

        expect(result).toEqual([
            "id1 - unable to find topic title",
            "id2 - unable to find topic title",
        ]);
        expect(logError).toHaveBeenCalledTimes(2);
        expect(logError).toHaveBeenCalledWith("error fetching topic", "id1", null, expect.any(Error));
        expect(logError).toHaveBeenCalledWith("error fetching topic", "id2", null, expect.any(Error));
    });
});

describe("getTopicTitle", () => {
    const reqCfg = null;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the topic title if API call is successful", async () => {
        httpGet.mockResolvedValueOnce({ title: "Sample Topic" });

        const result = await getTopicTitle("topicID1", reqCfg);

        expect(result).toEqual("Sample Topic");
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics/topicID1");
    });

    it("should return the 'current' title if available", async () => {
        httpGet.mockResolvedValueOnce({ current: { title: "Current Topic Title" } });

        const result = await getTopicTitle("topicID2", reqCfg);

        expect(result).toEqual("Current Topic Title");
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics/topicID2");
    });

    it("should return the 'next' title if available", async () => {
        httpGet.mockResolvedValueOnce({ next: { title: "Next Topic Title" } });

        const result = await getTopicTitle("topicID3", reqCfg);

        expect(result).toEqual("Next Topic Title");
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics/topicID3");
    });

    it("should return a fallback title if no title is available", async () => {
        httpGet.mockResolvedValueOnce({});

        const result = await getTopicTitle("topicID4", reqCfg);

        expect(result).toEqual("topicID4 - unable to find topic title");
        expect(httpGet).toHaveBeenCalledWith(reqCfg, "/topics/topicID4");
    });

    it("should log an error and return a fallback title if API call fails", async () => {
        httpGet.mockRejectedValueOnce(new Error("API error"));

        const result = await getTopicTitle("topicID5", reqCfg);

        expect(result).toEqual("topicID5 - unable to find topic title");
        expect(logError).toHaveBeenCalledWith("error fetching topic", "topicID5", null, expect.any(Error));
    });
});