import { logEvent } from "../log/log";

export default async function request(url) {
    logEvent(`making fetch request to: ${url}`)
    const response = await fetch(url);
    const json = await response.json();
    return json;
}