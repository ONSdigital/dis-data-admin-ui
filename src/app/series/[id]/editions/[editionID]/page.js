import { cookies } from "next/headers";
import Link from 'next/link';
import { pathname } from "next-extra/pathname";

import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import PageHeading from "@/components/page-heading/PageHeading";
import List from "@/components/list/List";
import { Panel } from "@/components/design-system/DesignSystem";
import CreateEditSuccess from "@/components/create-edit-success/CreateEditSuccess";

import { mapListItems } from "./mapper";
import { formatDate } from "@/utils/datetime/datetime";

export default async function Edition({ params, searchParams }) {
    const reqCfg = await SSRequestConfig(cookies);

    const { id, editionID } = await params;
    const query = await searchParams;
    let datasetResp = await httpGet(reqCfg, `/datasets/${id}`);
    let editionResp = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}`);
    let versions = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions`);

    let datasetError, editionError, versionsError = false;
    const listItems = [];
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    if (editionResp.ok != null && !editionResp.ok) {
        editionError = true;
    }

    if (versions.ok != null && !versions.ok) {
        versionsError = true;
    } else {
        listItems.push(...mapListItems(versions.items, id, editionID));
    }

    let unpublishedVersion = false;
    versions.items.forEach(item => {
        if (item.state != "published") {
            unpublishedVersion = true;
        }
    });

    const renderVersionsList = () => {
        return (
            <>
            { !versionsError ? 
                <>
                    <h2 className="ons-u-mt-m@xxs@m">Available versions</h2>
                    <List items={listItems} noResultsText="No editions found for dataset"></List>
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the list of versions for this dataset. Try refreshing the page.</p></Panel> }
            </>
        );
    };

    const dataset = datasetResp?.current || datasetResp?.next || datasetResp;
    const edition = editionResp?.current || editionResp?.next || editionResp;
    const createURL = `${edition.edition}/versions/create?edition_title=${edition.edition_title}`;
    const editURL = `/series/${id}/editions/${editionID}/edit`;
    const currentURL = await pathname();
    const breadcrumbs = generateBreadcrumb(currentURL, dataset.title, edition.edition_title);
    return (
        <>
            { !datasetError && !editionError ? 
                <>
                    <PageHeading 
                        subtitle="Edition"
                        title={dataset.title + ": " + edition.edition_title} 
                        buttonURL={createURL} 
                        buttonText="Create new version" 
                        linkURL={`../`}
                        linkText="Back to dataset list"
                        breadcrumbs={breadcrumbs}
                        showPanel={unpublishedVersion}
                        panelText="An unpublished version exists so cannot add new dataset version."
                        disbaleButton={!unpublishedVersion}
                    /> 
                    <div className="ons-grid ons-u-mt-xl">
                        <CreateEditSuccess query={query} message="Dataset edition saved" />
                        <div className="ons-grid__col ons-col-6@m">
                            { renderVersionsList() }
                        </div>
                        <div className="ons-grid__col ons-col-6@m ">
                            <Link href={editURL}>Edit metadata</Link>
                            <h2 className="ons-u-mt-m@xxs@m">Edition ID</h2>
                            <p data-testid="id-field">{edition.edition}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Title</h2>
                            <p data-testid="title-field">{edition.edition_title}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Release date</h2>
                            <p data-testid="release-date-field">{formatDate(edition.release_date)}</p>
                        </div>
                    </div>
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel> }
        </>
    );
}