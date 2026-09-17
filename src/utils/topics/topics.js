import { logError } from "../log/log";
import { getTopic } from "@/utils/request/api-clients/topics";

export function convertTopicIDsToTopicTitles(topicIDs, accessToken) {
    if (!topicIDs || topicIDs.length === 0) {
        return null;
    }

    return Promise.all(
        topicIDs.map((topicID) => getTopicTitle(topicID, accessToken))
    );
}

export async function getTopicTitle(topicID, accessToken) {
    try {
        const topic = await getTopic(topicID, accessToken);
        return topic?.response?.current?.title || topic?.response?.next?.title || topic?.response?.title || `${topicID} - unable to find topic title`;
    } catch (error) {
        logError("error fetching topic", topicID, null, error);
        return `${topicID} - unable to find topic title`;
    }
}