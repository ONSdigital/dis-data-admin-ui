import { httpGet } from "../request";
import getAppConfig from "../../config/config";

const getApiRouterURL = () => getAppConfig().apiRouterURL;

const getTopics = async (accessToken) => {
    return await httpGet(`${getApiRouterURL()}/topics`, accessToken);
};

const getTopic = async (topicID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/topics/${topicID}`, accessToken);
};

const getSubTopics = async (topicID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/topics/${topicID}/subtopics`, accessToken);
};

export { getTopics, getTopic, getSubTopics };
