import { httpGet } from "@/utils/request/request";

/**
 * Returns mapped topics with subtopics
 *
 * @param {any} reqCfg - Request configuration forwarded to {@link httpGet}.
 * @returns {<Array>}
 */
export const getAllTopics = async (reqCfg) => {
    const topics = await httpGet(reqCfg, "/topics");
    if (topics.ok != null && !topics.ok || topics?.items.length === 0) return [];

    const mappedTopics = await Promise.all(
        topics.items.map(async (topic) => {
            const t = topic.current || topic.next || topic;
            if (t.links?.subtopics?.href) {
                const subTubTopicURL = new URL(t.links.subtopics.href);
                const subTopic = await getSubTopics(reqCfg, subTubTopicURL.pathname.substring(3));
                return mapTopic(t, subTopic);
            }
        })
    );
    return mappedTopics;
};

/**
 * Returns mapped subtopics for a given topics.
 *
 * @param {any} reqCfg - Request configuration forwarded to {@link httpGet}.
 * @param {string} url - Endpoint path passed to {@link httpGet}.
 * @returns {<Array>}
 */
const getSubTopics = async (reqCfg, url) => {
    const subTopics = await httpGet(reqCfg, url);
    if (subTopics.ok != null && !subTopics.ok || subTopics?.items.length === 0) return [];

    const mappedSubTopics = subTopics.items.map(subTopic => {
        const st = subTopic.current || subTopic.next || subTopic;
        return mapTopic(st, null);
    });
    return mappedSubTopics;
};

/**
 * Maps a raw topic record (as returned by the API) into componeent ready shape.
 *
 * @param {object} topic - Raw topic from the API.
 * @param {<Array> | null} subTopics - Pre-mapped subtopics or null when mapping subtopic.
 * @returns {object}
 */
const mapTopic = (topic, subTopics) => {
    const mappedTopic = {
        id: topic.id,
        label: topic.title,
    };
    if (subTopics) mappedTopic.subtopics = subTopics;
    return mappedTopic;
};
