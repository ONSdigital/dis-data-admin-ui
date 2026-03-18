import { httpGet } from "@/utils/request/request";

export const getAllTopics = async (reqCfg) => {
    const topics = await httpGet(reqCfg, "/topics");
    if (topics.ok != null && !topics.ok || topics?.items.length === 0) return [];
    
    const mappedTopics = await Promise.all(
        topics.items.map(async (topic) => {
          const subTubTopicURL = new URL(topic.links.subtopics.href);
          const subTopic = await getSubTopics(reqCfg, subTubTopicURL.pathname.substring(3));
          return mapTopic(topic, subTopic);
        })
      );
    
      return mappedTopics;
}

const getSubTopics = async(reqCfg, url) => {
    const subTopics = await httpGet(reqCfg, url)
    if (subTopics.ok != null && !subTopics.ok || subTopics?.items.length === 0) return []
    const mappedSubTopics = []
    subTopics.items.forEach(subTopic => {
        mappedSubTopics.push(mapTopic(subTopic, null))
    })
    return mappedSubTopics;
}

const mapTopic = (topic, subTopics) => {
    return {
        id: topic.id,
        label: topic.title,
        subtopics: subTopics || null
    }
}