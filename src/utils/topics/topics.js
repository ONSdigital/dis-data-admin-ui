import { logError } from "../log/log";
import { httpGet } from "@/utils/request/request";

export function convertTopicIDsToTopicTitles(topicIDs, reqCfg) {
    return Promise.all(
        topicIDs.map(async (topicID) => {
            try {
                const response = await httpGet(reqCfg, `/topics/${topicID}`);
                return response?.current?.title || response?.next?.title || response?.title || `${topicID} - unable to find topic title`;
            } catch (error) {
                logError("error fetching topic", topicID, null, error);
                return `${topicID} - unable to find topic title`;
            }
        })
    );
}