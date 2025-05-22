import { logError } from "../log/log";
import { httpGet } from "@/utils/request/request";

export function convertTopicIDsToTopicTitles(topicIDs, reqCfg) {
    if (!topicIDs || topicIDs.length === 0) {
        return null;
    }

    return Promise.all(
        topicIDs.map((topicID) => getTopicTitle(topicID, reqCfg))
    );
}

export async function getTopicTitle(topicID, reqCfg) {
    try {
        const response = await httpGet(reqCfg, `/topics/${topicID}`);
        return response?.current?.title || response?.next?.title || response?.title || `${topicID} - unable to find topic title`;
    } catch (error) {
        logError("error fetching topic", topicID, null, error);
        return `${topicID} - unable to find topic title`;
    }
}