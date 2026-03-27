"use client";

import { useState, useMemo } from "react";
import { Field, Panel } from "author-design-system-react";
import Accordion from "../accordion/Accordion";
import Table from "../table/Table";

const getTopicID = (topicOrId) => {
    if (topicOrId === null || topicOrId === undefined) return null;
    if (typeof topicOrId === "object") return topicOrId.id ?? topicOrId.ID ?? null;
    return topicOrId;
};

export default function Topics({ listOfAllTopics, preSelectedTopics, topicsError }) {
    const [selectedTopics, setSelectedTopics] = useState(preSelectedTopics || []);
    const [mainTopicID, setMainTopicID] = useState(getTopicID(preSelectedTopics?.[0]));

    const selectedTopicIDsCsv = useMemo(() => {
        const mainId = getTopicID(mainTopicID);
        const selectedIds = (selectedTopics || [])
            .map((topic) => getTopicID(topic))
            .filter((id) => id !== null && id !== undefined);

        const orderedIds = mainId !== null && mainId !== undefined
            ? [mainId, ...selectedIds.filter((id) => id !== mainId)]
            : selectedIds;

        return orderedIds.join(",");
    }, [mainTopicID, selectedTopics]);

    const mainTopicOnChange = (topicID) => {
        setMainTopicID(topicID)
    }
    
    const topicSummary = useMemo(() => {
        const headers = [
            { label: "Topic", isSortable: false, rightAlign: false },
            { label: "Main topic", isSortable: false, rightAlign: true }
        ];

        const body =  {
            rows: []
        };

        selectedTopics?.forEach((item, index) => {
            body.rows.push(
                { 
                    columns: [
                        { content: item.label, rightAlign: false },
                        { content: [
                            <span className="ons-radios__item ons-radios__item--no-border" data-testid="quality-designation-radios-item-official-container">
                                <span className="ons-radio ons-radio--no-border" data-testid="quality-designation-radios-item-official">
                                    <input id="official" className="ons-radio__input" 
                                    data-testid="quality-designation-radios-item-official-input" 
                                    type="radio" value="official" name="quality-designation-radios" onClick={() => mainTopicOnChange(item.id)}
                                    checked={item.id === mainTopicID}
                                    />
                                    <label className="ons-radio__label" htmlFor="official" id="official-label" data-testid="quality-designation-radios-item-official-label">
                                        &nbsp;
                                    </label>
                                </span>
                            </span>], rightAlign: true},
                    ]
                }
            );
        });

        return { headers, body };
    }, [selectedTopics, mainTopicID]);

    const topicOnChange = (topic) => {
        // while no topics are curerently selected assume the first topic
        // selected to be the main topic until one is selected by the user
        if (selectedTopics?.length === 0) {
            setMainTopicID(topic.id)
        }
        setSelectedTopics(prev =>
            prev.some(t => t.id === topic.id)
                ? prev.filter(t => t.id !== topic.id)
                : [...prev, topic]
        );
    };

    const mapTopicsToTopicSelector = (topics) => {
        if (!topics) return [];
        return topics.map(topic => ({
            ...topic,
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
                        onChange={() => topicOnChange({ id: sub.id, label: sub.label })}
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
    }

    const accord = mapTopicsToTopicSelector(listOfAllTopics);

    return (
        <div className="ons-u-mt-l ons-u-mb-l">
            <h2>Choose a topic</h2>
            <Panel variant="info">
                <p>Choose a main topic for this series. This will be used in the URL and navigation. You can then select any other relevant topics.</p>
            </Panel>
            <Field dataTestId="field-dataset-series-topics" error={topicsError ? { id: "dataset-series-topics-error", text: topicsError } : null}>
                <input id="dataset-series-topics-input" type="hidden" name="dataset-series-topics-input" value={selectedTopicIDsCsv} />
                <Accordion id="topics-selector-accordion" accordionItems={accord} />
                <h3 className="ons-u-mt-m">Topic summary</h3>
                <Table contents={topicSummary} noResultsText="No topic selected" />
            </Field>
        </div>
    );
}
