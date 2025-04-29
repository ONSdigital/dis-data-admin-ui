import { convertTopicIDsToTopicTitles } from "./topics";
import { httpGet } from "../../utils/request/request";
import { logError } from "../log/log";

jest.mock("../../utils/request/request");
jest.mock("../log/log");

describe("convertTopicIDsToTopicTitles", () => {
    const reqCfg = null;

    afterEach(() => {
        jest.clearAllMocks();
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