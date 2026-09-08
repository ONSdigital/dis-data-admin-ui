import { httpGet } from "../request";
import getAppConfig from "../../config/config";

const getApiRouterURL = () => getAppConfig().apiRouterURL;

const getTopics = async (authToken) => {
    return await httpGet(`${getApiRouterURL()}/topics`, authToken);
};

const getTopic = async (topicID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/topics/${topicID}`, authToken);
};

const getSubTopics = async (topicID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/topics/${topicID}/subtopics`, authToken);
};

export { getTopics, getTopic, getSubTopics };
