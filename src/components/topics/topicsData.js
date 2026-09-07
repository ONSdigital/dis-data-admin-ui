import { getTopics, getTopic } from "@/utils/request/api-clients/topics";

// Topic slug's that we want to appear in Topic Selector UI
const INCLUDE_TOPIC_SLUGS = new Set([
    "businessindustryandtrade", // Business, industry and trade
    "census", // Census
    "economy", // Economy
    "employmentandlabourmarket", // Employment and labour market
    "peoplepopulationandcommunity", // People, population and community
]);

/**
 * Returns mapped topics with subtopics
 *
 * @param {any} accessToken - Auth token forwarded to {@link getTopics} / {@link getTopic}.
 * @returns {<Array>}
 */
export const getAllTopics = async (accessToken) => {
    const topics = await getTopics(accessToken);
    if (topics.error || topics?.response?.items.length === 0) return [];

    const includedItems = topics.response.items.filter((topic) => {
        const t = topic.current || topic.next || topic;
        return INCLUDE_TOPIC_SLUGS.has(String(t.slug));
    });

    return Promise.all(
        includedItems.map(async (topic) => {
            const t = topic.current || topic.next || topic;
            if (t.links?.subtopics?.href) {
                const subTopic = await getSubTopics(t.id, accessToken);
                return mapTopic(t, subTopic);
            }
        })
    ).then(results => {
        return results.sort((a, b) => a.label.localeCompare(b.label))
    });
};

/**
 * Returns mapped subtopics for a given topic.
 *
 * @param {string} topicID - Topic ID passed to {@link getTopic}.
 * @param {any} accessToken - Auth token forwarded to {@link getTopic}.
 * @returns {<Array>}
 */
const getSubTopics = async (topicID, accessToken) => {
    const subTopics = await getTopic(topicID, accessToken);
    if (subTopics.error || subTopics?.response?.items.length === 0) return [];

    const rows = await Promise.all(
        subTopics.response.items.map(async (subTopic) => {
            const st = subTopic.current || subTopic.next || subTopic;
            let nested = [];
            if (st.links?.subtopics?.href) {
                nested = await getSubTopics(topicID, accessToken);
            }

            // Subtopics that expose nested subtopics metadata are omitted
            // and their children are flattened into the returned list.
            if (st?.links?.subtopics?.href && Array.isArray(st?.subtopics_ids)) {
                return nested;
            }
            return [mapTopic(st, null), ...nested];
        })
    );
    return rows.flat();
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
        label: topic.title || "No label available",
    };
    if (subTopics) mappedTopic.subtopics = subTopics.sort((a, b) => a.label.localeCompare(b.label));
    return mappedTopic;
};
