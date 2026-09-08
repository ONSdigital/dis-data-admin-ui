jest.mock("@/utils/request/request");
jest.mock("@/utils/request/api-clients/topics", () => ({
    getTopic: jest.fn(),
}));
jest.mock("../log/log");

import { convertTopicIDsToTopicTitles, getTopicTitle } from "./topics";
import { getTopic } from "@/utils/request/api-clients/topics";
import { logError } from "../log/log";

describe("convertTopicIDsToTopicTitles", () => {
    const accessToken = null;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return null if topicIDs is null", async () => {
        const result = await convertTopicIDsToTopicTitles(null, accessToken);
        expect(result).toEqual(null);
    });

    it("should return null if topicIDs is an empty array", async () => {
        const result = await convertTopicIDsToTopicTitles([], accessToken);
        expect(result).toEqual(null);
    });

    it("should return topic titles for valid topicIDs", async () => {
        getTopic.mockResolvedValueOnce({ response: { title: "Topic 1" } });
        getTopic.mockResolvedValueOnce({ response: { title: "Topic 2" } });

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], accessToken);

        expect(result).toEqual(["Topic 1", "Topic 2"]);
        expect(getTopic).toHaveBeenCalledTimes(2);
        expect(getTopic).toHaveBeenCalledWith("id1", accessToken);
        expect(getTopic).toHaveBeenCalledWith("id2", accessToken);
    });

    it("should return fallback title if a topic title is missing", async () => {
        getTopic.mockResolvedValueOnce({ response: {} });
        getTopic.mockResolvedValueOnce({ response: { title: "Topic 2" } });

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], accessToken);

        expect(result).toEqual(["id1 - unable to find topic title", "Topic 2"]);
    });

    it("should log an error and return fallback title if an API call fails", async () => {
        getTopic.mockRejectedValueOnce(new Error("API error"));
        getTopic.mockResolvedValueOnce({ response: { title: "Topic 2" } });

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], accessToken);

        expect(result).toEqual(["id1 - unable to find topic title", "Topic 2"]);
        expect(logError).toHaveBeenCalledWith("error fetching topic", "id1", null, expect.any(Error));
    });

    it("should handle multiple API call failures", async () => {
        getTopic.mockRejectedValueOnce(new Error("API error 1"));
        getTopic.mockRejectedValueOnce(new Error("API error 2"));

        const result = await convertTopicIDsToTopicTitles(["id1", "id2"], accessToken);

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
    const accessToken = null;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the topic title if API call is successful", async () => {
        getTopic.mockResolvedValueOnce({ response: { title: "Sample Topic" } });

        const result = await getTopicTitle("topicID1", accessToken);

        expect(result).toEqual("Sample Topic");
        expect(getTopic).toHaveBeenCalledWith("topicID1", accessToken);
    });

    it("should return the 'current' title if available", async () => {
        getTopic.mockResolvedValueOnce({ response: { current: { title: "Current Topic Title" } } });

        const result = await getTopicTitle("topicID2", accessToken);

        expect(result).toEqual("Current Topic Title");
        expect(getTopic).toHaveBeenCalledWith("topicID2", accessToken);
    });

    it("should return the 'next' title if available", async () => {
        getTopic.mockResolvedValueOnce({ response: { next: { title: "Next Topic Title" } } });

        const result = await getTopicTitle("topicID3", accessToken);

        expect(result).toEqual("Next Topic Title");
        expect(getTopic).toHaveBeenCalledWith("topicID3", accessToken);
    });

    it("should return a fallback title if no title is available", async () => {
        getTopic.mockResolvedValueOnce({ response: {} });

        const result = await getTopicTitle("topicID4", accessToken);

        expect(result).toEqual("topicID4 - unable to find topic title");
        expect(getTopic).toHaveBeenCalledWith("topicID4", accessToken);
    });

    it("should log an error and return a fallback title if API call fails", async () => {
        getTopic.mockRejectedValueOnce(new Error("API error"));

        const result = await getTopicTitle("topicID5", accessToken);

        expect(result).toEqual("topicID5 - unable to find topic title");
        expect(logError).toHaveBeenCalledWith("error fetching topic", "topicID5", null, expect.any(Error));
    });
});