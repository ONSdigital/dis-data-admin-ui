import { httpGet } from "@/utils/request/request";

// Topic slug's that we don't want to appear in Topic Selector UI
// note: slug doesn't always match title
const EXCLUDED_TOPIC_SLUGS = new Set([
    "aboutus", // About us
    "help", // Help
    "methodology", // Methodolgy
    "news", // Media
    "surverys" // Our studies
]);

// Subtopic ID's that we don't want to appear in Topic Selector UI
const EXCLUDED_SUBTOPIC_IDS = new Set([
    "1678", // Population and migration
    "1792", // Cultural identity
    "1831", // Business
    "2364", // Household characteristics
    "3258", // Personal and household finances
    "4261", // Elections
    "4573", // Changes to business
    "6462", // People in work
    "7273", // People not in work
    "8268", // Government, public sector and taxes
    "8533", // Regional accounts
    "8629", // National accounts
    "8636", // Births, deaths and marriages"
    "8725", // Economic output and productivity
    "9559", // Health and social care
]);

/**
 * Returns mapped topics with subtopics
 *
 * @param {any} reqCfg - Request configuration forwarded to {@link httpGet}.
 * @returns {<Array>}
 */
export const getAllTopics = async (reqCfg) => {
    const topics = await httpGet(reqCfg, "/topics");
    if (topics.ok != null && !topics.ok || topics?.items.length === 0) return [];

    const includedItems = topics.items.filter((topic) => {
        const t = topic.current || topic.next || topic;
        return !EXCLUDED_TOPIC_SLUGS.has(String(t.slug));
    });

    return Promise.all(
        includedItems.map(async (topic) => {
            const t = topic.current || topic.next || topic;
            if (t.links?.subtopics?.href) {
                const subTubTopicURL = new URL(t.links.subtopics.href);
                const subTopic = await getSubTopics(reqCfg, subTubTopicURL.pathname.substring(3));
                return mapTopic(t, subTopic);
            }
        })
    );
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
    if (subTopics.ok != null && !subTopics.ok || !subTopics?.items?.length) return [];

    const rows = await Promise.all(
        subTopics.items.map(async (subTopic) => {
            const st = subTopic.current || subTopic.next || subTopic;
            let nested = [];
            if (st.links?.subtopics?.href) {
                const subTubTopicURL = new URL(st.links.subtopics.href);
                nested = await getSubTopics(reqCfg, subTubTopicURL.pathname.substring(3));
            }

            // Excluded subtopics are omitted and their children are added into list
            if (EXCLUDED_SUBTOPIC_IDS.has(String(st.id))) {
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
    if (subTopics) mappedTopic.subtopics = subTopics;
    return mappedTopic;
};
