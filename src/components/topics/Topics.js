"use client";

import { useState, useEffect } from "react";
import { Field, Button, Checkbox, Panel } from "author-design-system-react";
import Accordion from "../accordion/Accordion";
import { getAllTopics, mapTopicsToTopicSelector } from "./topicsData";
import Table from "../table/Table";

export default function Topics({ listOfAllTopics, preSelectedTopics, topicsError }) {
    const [selectedTopics, setSelectedTopics] = useState(preSelectedTopics || []);
    const [topicSummary, setTopicSummary] = useState();
    const [mainTopic, setMainTopic] = useState(preSelectedTopics[0] || null);
    // const [selectedTopics, setSelectedTopics] = useState(preSelectedTopics);
    // const [checkboxOptionsItems, setCheckboxOptionsItems] = useState(createCheckboxes);

    const mainTopicOnChange = (topic) => {
        setMainTopic(topic)
    }

    const mapTopicSummaryTable = (data) => {
        const headers = [
            { label: "Topic", isSortable: false, rightAlign: false },
            { label: "Main topic", isSortable: false, rightAlign: true }
        ];

        const body =  {
            rows: []
        };

        data?.forEach((item, index) => {
            body.rows.push(
                { 
                    columns: [
                        { content: item.label, rightAlign: false },
                        { content: [
                            <span className="ons-radios__item ons-radios__item--no-border" data-testid="quality-designation-radios-item-official-container">
                                <span className="ons-radio ons-radio--no-border" data-testid="quality-designation-radios-item-official">
                                    <input id="official" className="ons-radio__input" 
                                    data-testid="quality-designation-radios-item-official-input" 
                                    type="radio" value="official" name="quality-designation-radios" onClick={() => mainTopicOnChange({id: item.id, label: item.label})}
                                    checked={item.id === mainTopic.id}
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
    }

    useEffect(() => {
        setTopicSummary(mapTopicSummaryTable(selectedTopics));
    }, [selectedTopics, mainTopic]);

    // useEffect(() => {
    //     /* eslint-disable-next-line react-hooks/set-state-in-effect */
    //     setCheckboxOptionsItems(createCheckboxes);
    // }, [selectedTopics]);

    // useEffect(() => {
    //     checkboxOptionsItems.itemsList.forEach(checkboxOption => {
    //         const checkbox = document.getElementById(checkboxOption.id);
    //         if (checkboxOption.checked === false) {
    //             checkbox.defaultChecked = false;
    //         }
    //     });
    // }, [checkboxOptionsItems]);


    // function createCheckboxes() {
    //     const checkboxOptions = [];
    //     listOfAllTopics.forEach(topic => {
    //         const topicId = topic.current?.id || topic.next?.id || topic.id || "missing id";
    //         const topicTitle = topic.current?.title || topic.next?.title || topic.title || "missing title";
    //         const selected = selectedTopics.includes(topicId);

    //         if (topicId && topicTitle) {
    //             checkboxOptions.push({
    //                 dataTestId: "checkbox-" + topicId,
    //                 id: "checkbox-" + topicId,
    //                 label: {
    //                     text: topicTitle
    //                 },
    //                 onChange: () => { topicOnChange(topicId); },
    //                 value: topicId,
    //                 checked: selected
    //             });
    //         }
    //     });
    //     return ({ itemsList: checkboxOptions });
    // }

    const topicOnChange = (topic) => {
        // while no topics are curerently selected assume the first topic
        // selected to be the main topic until one is selected by the user
        if (selectedTopics?.length === 0) {
            setMainTopic(topic)
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
                <input id="dataset-series-topics-input" type="hidden" name="dataset-series-topics-input" value={JSON.stringify(selectedTopics)} />
                <Accordion id="topics-selector-accordion" accordionItems={accord} />
                <h3 className="ons-u-mt-m">Topic summary</h3>
                <Table contents={topicSummary} noResultsText="No topic selected" />
            </Field>
        </div>
    );

    return (
        <>
            <Field dataTestId="field-dataset-series-topics" error={topicsError ? { id: "dataset-series-topics-error", text: topicsError } : null}>
                <input id="dataset-series-topics-input" type="hidden" name="dataset-series-topics-input" value={JSON.stringify(selectedTopics)} />
                <Checkbox
                    id="dataset-series-topics"
                    dataTestId="dataset-series-topics-checkbox"
                    items={checkboxOptionsItems}
                    legend="Topics"
                    borderless
                    classes="ons-u-mb-m"
                />
                <Button
                    id="dataset-series-clear-topic-selection-button"
                    dataTestId="dataset-series-clear-topic-selection-button"
                    text="Clear Selection"
                    variants={[
                        "secondary",
                        "small"
                    ]}
                    onClick={() => {
                        const inputs = document.querySelectorAll("input[type='checkbox']");
                        for (let i = 0; i < inputs.length; i++) {
                            inputs[i].checked = false;
                        }
                        setSelectedTopics([]);
                    }}
                />
            </Field>
        </>
    );
}
