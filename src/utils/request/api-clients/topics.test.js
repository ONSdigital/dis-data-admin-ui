jest.mock("../request", () => ({
    httpGet: jest.fn(),
}));

jest.mock("../../config/config", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        apiRouterURL: "http://api.test",
    })),
}));

import { httpGet } from "../request";
import { getTopics, getTopic, getSubTopics } from "./topics";

describe("topics api client", () => {
    const authToken = "token";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getTopics calls httpGet with the correct URL and auth token", async () => {
        await getTopics(authToken);
        expect(httpGet).toHaveBeenCalledWith("http://api.test/topics", authToken);
    });

    it("getTopic calls httpGet with the correct URL and auth token", async () => {
        await getTopic("topic-1", authToken);
        expect(httpGet).toHaveBeenCalledWith("http://api.test/topics/topic-1", authToken);
    });

    it("getSubTopics calls httpGet with the correct URL and auth token", async () => {
        await getSubTopics("topic-1", authToken);
        expect(httpGet).toHaveBeenCalledWith("http://api.test/topics/topic-1/subtopics", authToken);
    });
});
