'use client'

import { useState } from 'react';

import { Field, Button} from "author-design-system-react";

export default function Topics({listOfTopics, topics, setTopics, topicsError}) {
    const [topicValue, setTopicValue] = useState("");
    const [topicText, setTopicText] = useState("");
    const [topicList, setTopicList] = useState([]);

    const topicSelectOptions = [{                        
        value: "",
        text: "Select an option",
    }]

    listOfTopics.forEach(topic => {
        topicSelectOptions.push({
            "value": topic.id,
            "text": topic.title
        })
    });

    // This is for setting up the topic list when editing a dataseries which already has topics associated with it.
    if(topics.length > 0 && topicList.length == 0){
        const currentTopicList = []
        topics.forEach(topic => {
            const result = listOfTopics.find(({ id }) => id === topic )
            currentTopicList.push({
                id : result.id, 
                text : result.title
            })
        })
        setTopicList(currentTopicList)
    }

    // This is for successful submission to clear the topiclist.
    if(topics.length == 0 && topicList.length > 0){
        setTopicList([])
    }

    const renderTopicsList = () => {
        return (
            <>
                { topicList ?  
                    <ul className="ons-document-list ons-u-mt-s">
                    {topicList.map((topic) => (
                        <li data-testid="dataset-series-topics-list-item" key={topic.id}>
                            <div className="ons-document-list__item-content">
                                <div className="ons-grid">
                                    <div className="ons-grid__col ons-col-3@m">
                                        <span className="ons-u-fw">{topic.text}</span>
                                    </div>
                                    <div className="ons-grid__col ons-col-2@m">
                                        <Button 
                                            id="dataset-series-remove-contact-button"
                                            dataTestId="dataset-series-remove-contact-button"
                                            text="Remove"
                                            variants={[
                                                'tertiary',
                                                'small'
                                            ]}
                                            onClick={() => {
                                                setTopics(
                                                    topics.filter(t => 
                                                        t !== topic.id
                                                    )
                                                );
                                                setTopicList(
                                                    topicList.filter(t =>
                                                        t.id !== topic.id
                                                    )
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul> : null
                }
            </>
        )
    }

    return (
        <>
            <Field dataTestId="field-dataset-series-topics" error={topicsError ? {id:'dataset-series-topics-error', text: topicsError} : null}>
                <input id="dataset-series-topics" type="hidden" name="dataset-series-topics" value={JSON.stringify(topics)} />
                <div className='ons-container--wide'>
                    <div className="ons-grid ons-grid--spaced">                
                        <div className="ons-grid__col ons-col-4@m">
                            <label className="ons-label" htmlFor="dataset-series-topic">Topics</label>
                            <select
                                id="dataset-series-topic"
                                data-testid="dataset-series-topics-select"
                                className="ons-input ons-input--select"
                                defaultValue=""
                                onChange={e => {
                                    setTopicValue(e.target.value)
                                    setTopicText(e.target.selectedOptions[0].text)
                                }}
                            >
                            {topicSelectOptions.map((topic) => (
                                <option data-testid="dataset-series-topics-option" key={topic.value} value={topic.value}>{topic.text}</option>
                            ))}
                            </select>
                        </div>
                        <div className="ons-grid__col ons-col-2@m ons-u-mt-l">
                            <Button
                                id="dataset-series-add-topic-button"
                                dataTestId="dataset-series-add-topic-button"
                                text="Add Topic"
                                variants={[
                                    'secondary',
                                    'small'
                                ]}
                                onClick={ () => {
                                    if(!topics.includes(topicValue)){
                                        setTopics([
                                            ...topics,
                                            topicValue
                                        ]);
                                        setTopicList([
                                            ...topicList,
                                            {
                                                id : topicValue, 
                                                text : topicText
                                            }
                                        ])
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                {renderTopicsList()}
            </Field>
        </>
    );
}
