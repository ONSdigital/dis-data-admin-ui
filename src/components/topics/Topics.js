"use client";

import { useState, useMemo, useEffect } from "react";
import { Field, Panel } from "author-design-system-react";
import Accordion from "../accordion/Accordion";
import Table from "../table/Table";

// get ID of a topic whatever form it comes in
const getTopicID = (topicOrID) => {
    if (topicOrID === null || topicOrID === undefined) return null;
    if (typeof topicOrID === "object") return topicOrID.id ?? topicOrID.ID ?? null;
    return topicOrID;
};

// generate JSON string of comma seperated IDs. used to track changes more reliably than watching preSelectedTopics array
const topicsListKey = (topics) => {
    const idStrings = (topics ?? []).map((t) => getTopicID(t));
    return JSON.stringify(idStrings);
};

// get a topic label from a topic or topicID
const getTopicLabel = (topicOrID, topics) => {
    const id = getTopicID(topicOrID);
    if (id == null || id === undefined) return null;
    if (!topics?.length) return null;
    for (const topic of topics) {
        if (getTopicID(topic) === id) return topic.label;
        const subs = topic.subtopics;
        if (subs?.length) {
            const sub = subs.find((s) => getTopicID(s) === id);
            if (sub) return sub.label;
        }
    }
    return null;
};

export default function Topics({ listOfAllTopics, preSelectedTopics, topicsError }) {
    const [selectedTopics, setSelectedTopics] = useState(() => preSelectedTopics || []);
    const [mainTopic, setMainTopic] = useState(() => getTopicID(preSelectedTopics?.[0]));

    // preSelectedTopics updates after a failed submit (original submission returned) but
    // useState only initialises once — keep local state in sync with the prop.
    const preSelectedTopicsKey = topicsListKey(preSelectedTopics);
    useEffect(() => {
        const topicsFromProps = preSelectedTopics || [];
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setSelectedTopics(topicsFromProps);
        setMainTopic(getTopicID(topicsFromProps[0]));
    }, [preSelectedTopicsKey, preSelectedTopics]);

    // track selectedTopics and mainTopic in a correctly ordered list to submit to API. 
    // e.g. keep selected mainTopic as first in the list because API infers first is main
    const orderedTopicsList = useMemo(() => {
        const list = selectedTopics || [];
        const mainID = getTopicID(mainTopic);

        const mainTopicObj =
            list.find((t) => getTopicID(t) === mainID) ??
            (typeof mainTopic === "object" && mainTopic !== null ? mainTopic : null);

        const others = list.filter((t) => getTopicID(t) !== mainID);

        if (mainID !== null && mainID !== undefined && mainTopicObj !== null) {
            return [mainTopicObj, ...others];
        }

        return list;
    }, [mainTopic, selectedTopics]);

    const handleMainTopicChange = (topic) => {
        setMainTopic(topic);
    };
    
    // re-map topic summary when selectedTopics or mainTopic changes
    const topicSummary = useMemo(() => {
        const headers = [
            { label: "Topic", isSortable: false, rightAlign: false },
            { label: "Main topic", isSortable: false, rightAlign: true }
        ];

        const body =  {
            rows: []
        };

        selectedTopics?.forEach((topic) => {
            const elementID = `main-topic-selector-radios-item-${topic.id}}`;
            body.rows.push(
                { 
                    columns: [
                        { content: topic.label ? topic.label : getTopicLabel(topic, listOfAllTopics), rightAlign: false },
                        { content: 
                            <span className="ons-radios__item ons-radios__item--no-border" 
                                data-testid={`${elementID}-container`}
                            >
                                <span className="ons-radio ons-radio--no-border" 
                                    data-testid="${elementID}"
                                >
                                    <input id={`${topic.id}-radio`} 
                                        className="ons-radio__input" 
                                        data-testid={`${elementID}-input`} 
                                        type="radio" 
                                        value={topic.id} 
                                        name="main-topic-selector-radios" 
                                        onChange={() => handleMainTopicChange(topic)}
                                        checked={getTopicID(topic) === getTopicID(mainTopic)}
                                    />
                                    <label className="ons-radio__label" 
                                        htmlFor={`${topic.id}-radio`} 
                                        id={`${elementID}-label`} 
                                        data-testid={`${elementID}-label`}
                                    >
                                        &nbsp;
                                    </label>
                                </span>
                            </span>, 
                            rightAlign: true
                        },
                    ]
                }
            );
        });

        return { headers, body };
    }, [selectedTopics, mainTopic, listOfAllTopics]);

    const handleTopicChange = (topic) => {
        // while no topics are curerently selected assume the first topic
        // selected to be the main topic until one is selected by the user
        if (selectedTopics?.length === 0) {
            setMainTopic(topic);
        }
        setSelectedTopics((prev) =>
            prev.some((t) => getTopicID(t) === getTopicID(topic))
                ? prev.filter((t) => getTopicID(t) !== getTopicID(topic))
                : [...prev, topic]
        );
    };

    const mapTopicsToTopicSelector = (topics) => {
        if (!topics) return [];
        return topics.map(topic => ({
            ...topic,
            isOpen: topic.subtopics?.some((sub) =>
                selectedTopics.some((t) => getTopicID(t) === getTopicID(sub))
            ) ?? false,
            body: topic.subtopics?.map(sub => (
                <span
                    className="ons-checkbox ons-checkbox--no-border ons-u-mb-xs"
                    data-testid={`dataset-series-topic-${sub.id}-checkbox`}
                    key={`${topic.id}-${sub.id}`}
                >
                    <input
                        type="checkbox"
                        id={sub.id}
                        name={sub.id}
                        className="ons-checkbox__input"
                        checked={selectedTopics.some((t) => getTopicID(t) === getTopicID(sub))}
                        onChange={() => handleTopicChange(sub)}
                    />
                    <label
                        className="ons-checkbox__label"
                        htmlFor={sub.id}
                        id={`${sub.id}-label`}
                        data-testid={`dataset-series-topic-${sub.id}-label`}
                    >
                        <span>{sub.label}</span>
                    </label>
                </span>
            ))
        }));
    };

    const topicAccordionItems = mapTopicsToTopicSelector(listOfAllTopics);

    return (
        <div className="ons-u-mt-l ons-u-mb-l">
            <h2>Choose a topic</h2>
            <Panel variant="info">
                <p>Choose a main topic for this series. This will be used in the URL and navigation. You can then select any other relevant topics.</p>
            </Panel>
            <Field dataTestId="field-dataset-series-topics" error={topicsError ? { id: "dataset-series-topics-error", text: topicsError } : null}>
                <input id="dataset-series-topics-input" type="hidden" name="dataset-series-topics-input" value={JSON.stringify(orderedTopicsList || [])} />
                <Accordion id="topics-selector-accordion" accordionItems={topicAccordionItems} />
                <h3 className="ons-u-mt-m">Topic summary</h3>
                <Table contents={topicSummary} noResultsText="No topic selected" />
            </Field>
        </div>
    );
}
