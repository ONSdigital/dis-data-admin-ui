"use client";

import Link from "next/link";

import { useState, useActionState } from "react";

import { TextInput, Panel, HyperLinksList} from "author-design-system-react";

import Topics from "@/components/topics/Topics";
import Contact from "@/components/contact/Contact";
import TextArea from "@/components/textarea/Textarea";

export default function SeriesForm({currentTitle = "", currentID = "", currentDescription = "", currentTopics = [], currentQMI = "", currentKeywords = "", currentContacts = [], listOfAllTopics, action}) {
    const [id, setID] = useState(currentID);
    const [title, setTitle] = useState(currentTitle);
    const [selectedTopics, setSelectedTopics] = useState(currentTopics);
    const [description, setDescription] = useState(currentDescription);
    const [qmi, setQMI] = useState(currentQMI);
    const [keywords, setKeywords] = useState(currentKeywords);
    const [contacts, setContacts] = useState(currentContacts);

    const [formState, formAction, isPending] = useActionState(action, {});
    const [savedDatasetURL, setSavedDatasetURL] = useState("");

    let listOfErrors = [];

    if (formState.errors){
        Object.values(formState.errors).map((error) => (
            listOfErrors = [
                ...listOfErrors,
                {text: error}
            ]
        ));
    } 

    if (formState.recentlySubmitted == true) {
        formState.recentlySubmitted = false;
        setSavedDatasetURL("/series/" + id);
        setTitle("");
        setID("");
        setDescription("");
        setQMI("");
        setKeywords("");
        setContacts([]);
        setSelectedTopics([]);
    }

    if(isPending){
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    const renderSuccessOrFailure = () => {
        return (
            <>
                { formState.success == true  ?
                    <Panel variant="success">
                        <p>Dataset series saved. <Link href={savedDatasetURL}>View dataset</Link></p>
                    </Panel> : null
                }
                { formState.success == false && !formState.code ?    
                    <Panel title="There was a problem submitting your form" variant="error">
                        <HyperLinksList itemsList={listOfErrors}/>
                    </Panel> : null
                }
                { formState.success == false && formState.code >= 400 ?    
                    <Panel title="There was a problem submitting your form" variant="error">
                        <p>{formState.httpError || "An unknown error occurred"}</p>
                    </Panel> : null
                }
            </>
        );
    };

    return (
        <>
            {renderSuccessOrFailure()}
            <h2 className="ons-u-mt-m">Series details</h2>
            <p>The information in these fields is unique to a series.</p>
            <form action={formAction}>
                <input id="dataset-series-type" name="dataset-series-type" type="hidden" value="static" />
                <input id="dataset-series-license" name="dataset-series-license" type="hidden" value="Open Government License v3.0" />
                { currentID != "" ? <input id="dataset-series-id" data-testid="dataset-series-id" name="dataset-series-id" type="hidden" value={id} /> : null}
                { currentID == "" ?  
                    <TextInput 
                        id="dataset-series-id"
                        dataTestId="dataset-series-id"
                        name="dataset-series-id"
                        label={{
                            text: "ID",
                            description: `E.g "labour-market" or "weekly-registered-deaths"`,
                        }}
                        error={(formState.errors && formState.errors.id)  ? {id:"dataset-series-id-error", text: formState.errors.id} : null}
                        value={id}
                        onChange={e => setID(e.target.value)}
                    /> : null
                }
                <TextInput 
                    id="dataset-series-title"
                    dataTestId="dataset-series-title"
                    name="dataset-series-title"
                    label={{
                        text: "Title",
                        description: `E.g "Labour market" or "Deaths registered weekly in England and Wales"`
                    }}
                    error={(formState.errors && formState.errors.title) ? {id:"dataset-series-title-error", text: formState.errors.title} : null}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <Topics 
                    listOfAllTopics={listOfAllTopics} 
                    selectedTopics={selectedTopics} 
                    setSelectedTopics={setSelectedTopics} 
                    topicsError={(formState.errors && formState.errors.topics) ? formState.errors.topics : null}
                />
                <TextArea 
                    id={"dataset-series-description"}
                    dataTestId={"dataset-series-description"}
                    name={"dataset-series-description"}
                    label={{text: "Description"}} 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    error={(formState.errors && formState.errors.description) ? {id:"dataset-series-description-error", text: formState.errors.description} : null}
                />
                <TextInput 
                    id="dataset-series-qmi"
                    dataTestId="dataset-series-qmi"
                    name="dataset-series-qmi"
                    label={{
                        text: "QMI",
                        description: "URL to related QMI documentation"
                    }}
                    error={(formState.errors && formState.errors.qmi) ? {id:"dataset-series-qmi-error", text: formState.errors.qmi} : null}
                    value={qmi}
                    onChange={e => setQMI(e.target.value)}
                />
                <TextInput 
                    id="dataset-series-keywords"
                    dataTestId="dataset-series-keywords"
                    name="dataset-series-keywords"
                    label={{
                        text: "Keywords",
                        description: `Comma separated list of keywords e.g. "economy, inflation, prices"`
                    }}
                    error={(formState.errors && formState.errors.keywords) ? {id:"dataset-series-keywords-error", text: formState.errors.keywords} : null}
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                />
                <Contact 
                    contacts={contacts} 
                    setContacts={setContacts} 
                    contactsError={(formState.errors && formState.errors.contacts) ? formState.errors.contacts : null}
                />
                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset series</span></span>
                </button>
            </form>
        </>
    );
}
