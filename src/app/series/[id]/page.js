import { cookies } from "next/headers";
import Link from 'next/link';

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { formatDate } from "@/utils/datetime/datetime";

import Hero from "@/components/hero/Hero";
import List from "@/components/list/List";
import Panel from "@/components/panel/Panel";
import CreateEditSuccess from "@/components/create-edit-success/CreateEditSuccess";

import { mapListItems } from './mapper';
import { convertTopicIDsToTopicTitles } from "@/utils/topics/topics";

export default async function Dataset({ params, searchParams }) {
    const { id } = await params;
    const query = await searchParams;

    const reqCfg = await SSRequestConfig(cookies);
    let datasetResp = await httpGet(reqCfg, `/datasets/${id}`);
    let editions = await httpGet(reqCfg, `/datasets/${id}/editions`);

    let datasetError, editionsError = false;
    const listItems = [];
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    if (editions.ok != null && !editions.ok) {
        editionsError = true;
    } else {
        listItems.push(...mapListItems(editions.items, id));
    }

    const renderEditionsList = () => {
        return (
            <>
            { !editionsError ? 
                <>
                    <h2 className="ons-u-mt-m@xxs@m">Available editions</h2>
                    <List items={listItems} noResultsText="No editions found for dataset"></List>
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the list of editions for this dataset. Try refreshing the page.</p></Panel> }
            </>
        );
    };

    const createURL = `${id}/editions/create`;
    const editURL = `/series/${id}/edit`;
    const dataset = datasetResp?.next || datasetResp?.current || datasetResp;
    const topicTitles = await convertTopicIDsToTopicTitles(dataset.topics, reqCfg);
    return (
        <>
            { !datasetError ? 
                <>
                    <Hero hyperLink={{ text: "Add new dataset edition", url: createURL }} title={dataset.title} wide />           
                    <div className="ons-grid ons-u-mt-xl">
                        <CreateEditSuccess query={query} message="Dataset series saved" />
                        <div className="ons-grid__col ons-col-6@m">
                            { renderEditionsList() }
                        </div>
                        <div className="ons-grid__col ons-col-6@m ">
                            <Link href={editURL}>Edit metadata</Link>

                            <h2 className="ons-u-mt-m@xxs@m">Series ID</h2>
                            <p data-testid="id-field">{dataset.id}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Type</h2>
                            <p data-testid="type-field">{dataset.type}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Title</h2>
                            <p data-testid="title-field">{dataset.title}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Description</h2>
                            <p data-testid="description-field">{dataset.description}</p>

                            {topicTitles && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Topics</h2>
                                    <ul data-testid="topics-field">
                                        {topicTitles.map((topicTitle, index) => (
                                            <li className="ons-u-mb-no" key={index}>{topicTitle}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <h2 className="ons-u-mt-m@xxs@m">Last updated</h2>
                            <p data-testid="last-updated-field">
                                {formatDate(dataset.last_updated)}
                            </p>

                            <h2 className="ons-u-mt-m@xxs@m">License</h2>
                            <p data-testid="license-field">{dataset.license}</p>

                            {dataset.next_release && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Next release</h2>
                                    <p data-testid="next-release-field">{dataset.next_release}</p>
                                </>
                            )}

                            {dataset.keywords && dataset.keywords.length > 0 && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Keywords</h2>
                                    <ul data-testid="keywords-field">
                                        {dataset.keywords.map((keyword, index) => (
                                            <li className="ons-u-mb-no" key={index}>{keyword}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            
                            {dataset.qmi && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">QMI</h2>
                                    <p data-testid="qmi-field">
                                        <a href={dataset.qmi.href} target="_blank">{dataset.qmi.href}</a>
                                    </p>
                                </>
                            )}

                            {dataset.contacts && dataset.contacts.length > 0 && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Contacts</h2>
                                    <div data-testid="contacts-field">
                                        {dataset.contacts.map((contact, index) => (
                                            <div key={index} className="ons-text-indent">
                                                <p data-testid={`contact-name-field-${index}`} className="ons-u-mb-no">{contact.name}</p>
                                                <p className="ons-u-mb-no">
                                                    <a href={`mailto:${contact.email}`} data-testid={`contact-email-field-${index}`}>{contact.email}</a>
                                                </p>
                                                {contact.telephone && (
                                                    <p className="ons-u-mb-no">
                                                        <a href={`tel:${contact.telephone}`} data-testid={`contact-telephone-field-${index}`}>{contact.telephone}</a>
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {dataset.publisher && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Publisher</h2>
                                    <p data-testid="publisher-name-field" className="ons-u-mb-no">{dataset.publisher.name}</p>
                                    <p data-testid="publisher-href-field" className="ons-u-mb-no">
                                        <a href={dataset.publisher.href} target="_blank">{dataset.publisher.href}</a>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel> }
        </>
    );
}
