import { logError } from "../log/log";
import { httpGet } from "@/utils/request/request";

export async function convertTopicIDsToTopicTitles(topicIDs, reqCfg) {
    if (!topicIDs || topicIDs.length === 0) {
        return [];
    }

    const topicTitles = await Promise.all(
        topicIDs.map(async (topicID) => {
            try {
                const response = await httpGet(reqCfg, `/topics/${topicID}`);
                return response?.title || `${topicID} - unable to find topic title`;
            } catch (error) {
                logError("error fetching topic", topicID, null, error);
                return `${topicID} - unable to find topic title`;
            }
        })
    );
    return topicTitles;
}