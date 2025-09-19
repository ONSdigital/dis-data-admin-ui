'use client';

import { Field, Button, Checkbox } from "author-design-system-react";

export default function Topics({listOfAllTopics, selectedTopics, setSelectedTopics, topicsError}) {
    const checkboxOptions = []
    listOfAllTopics.forEach(topic => {
        const topicId = topic.current?.id || topic.next?.id || topic.id || "missing id";
        const topicTitle = topic.current?.title || topic.next?.title || topic.title || "missing title";
        const selected = selectedTopics.includes(topicId)

        if (topicId && topicTitle) {
            checkboxOptions.push({
                dataTestId: 'checkbox-' + topicId,
                id: 'checkbox-' + topicId,
                label: {
                    text: topicTitle
                },
                onClick: () => { },
                onChange: () => {
                    if (!selectedTopics.includes(topicId)) {
                        setSelectedTopics([
                            ...selectedTopics,
                            topicId
                        ]);
                    } else {
                        setSelectedTopics(
                            selectedTopics.filter(t =>
                                t !== topicId
                            )
                        );
                    }
                },
                value: topicId,
                checked: selected
            });
        }
    });

    return (
        <>
            <Field dataTestId="field-dataset-series-topics" error={topicsError ? {id:'dataset-series-topics-error', text: topicsError} : null}>
                <input id="dataset-series-topics-input" type="hidden" name="dataset-series-topics-input" value={JSON.stringify(selectedTopics)} />
                <Checkbox
                    id="dataset-series-topics"
                    dataTestId="dataset-series-topics-checkbox"
                    items={{
                        itemsList: checkboxOptions
                    }}
                    legend="Topics"
                    borderless
                    classes='ons-u-mb-m'
                />
                <Button
                    id="dataset-series-clear-topic-selection-button"
                    dataTestId="dataset-series-clear-topic-selection-button"
                    text="Clear Selection"
                    variants={[
                        'secondary',
                        'small'
                    ]}
                    onClick={() => {
                        var inputs = document.querySelectorAll("input[type='checkbox']");
                        for (var i = 0; i < inputs.length; i++) {
                            inputs[i].checked = false;
                        }
                        setSelectedTopics([])
                    }}
                />
            </Field>
        </>
    );
}
