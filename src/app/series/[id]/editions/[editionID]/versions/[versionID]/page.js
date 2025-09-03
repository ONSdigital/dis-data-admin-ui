import { cookies } from "next/headers";
import Link from "next/link";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { formatDate } from "@/utils/datetime/datetime";

import Hero from "@/components/hero/Hero";
import { Panel } from "@/components/design-system/DesignSystem";
import CreateEditSuccess from "@/components/create-edit-success/CreateEditSuccess";

export default async function Version({ params, searchParams }) {
    const { id, editionID, versionID } = await params;
    const query = await searchParams;
    const reqCfg = await SSRequestConfig(cookies);
    let metadata = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions/${versionID}/metadata`);

    let metadataError = false;
    if (metadata.ok != null && !metadata.ok) {
        metadataError = true;
    }

    return (
        <>
        <Hero hyperLink={{ text: `Back to list of versions`, url: "../"}} title={`${metadata.edition_title}`} wide/>
            { !metadataError ?
                <>
                    <div className="ons-grid ons-u-mt-xl">
                        <CreateEditSuccess query={query} message="Dataset version saved" />
                        <div className="ons-grid__col ons-col-6@m ">
                        <Link href={`${versionID}/edit`}>Edit metadata</Link>
                            <h2 className="ons-u-mt-m@xxs@m">Series ID</h2>
                            <p data-testid="id-field">{metadata.id}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Edition</h2>
                            <p data-testid="edition-field">{metadata.edition}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Edition title</h2>
                            <p data-testid="edition-title-field">{metadata.edition_title}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Release date</h2>
                            <p data-testid="release-date-field">
                                {formatDate(metadata.release_date)}
                            </p>

                            <h2 className="ons-u-mt-m@xxs@m">Version</h2>
                            <p data-testid="version-field">{metadata.version}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Last updated</h2>
                            <p data-testid="last-updated-field">
                                {formatDate(metadata.last_updated)}
                            </p>

                            {metadata.quality_designation && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Quality designation</h2>
                                    <p data-testid="quality-designation-field">{metadata.quality_designation}</p>
                                </>
                            )}

                            {metadata.usage_notes && metadata.usage_notes.length > 0 && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Usage notes</h2>
                                    {metadata.usage_notes.map((item, index) => (
                                        <div key={index}>
                                            <h3 data-testid={`usage-note-title-${index}`}>{item.title}</h3>
                                            <p data-testid={`usage-note-text-${index}`}>{item.note}</p>
                                        </div>
                                    ))}
                                </>
                            )}

                            {metadata.alerts && metadata.alerts.length > 0 && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Alerts</h2>
                                    {metadata.alerts.map((alert, index) => (
                                        <div key={index}>
                                            <h3 data-testid={`alert-type-${index}`}>{alert.type}</h3>
                                            <p data-testid={`alert-date-${index}`}>{formatDate(alert.date)}</p>
                                            <p data-testid={`alert-description-${index}`}>{alert.description}</p>
                                        </div>
                                    ))}
                                </>
                            )}

                            {metadata.distributions && metadata.distributions.length > 0 && (
                                <>
                                    <h2 className="ons-u-mt-m@xxs@m">Downloads</h2>
                                    {metadata.distributions.map((distribution, index) => (
                                        <div key={index}>
                                            <h3 data-testid={`distribution-title-${index}`}>{distribution.title}</h3>
                                            <p data-testid={`distribution-format-${index}`}>{distribution.format}</p>
                                            <p data-testid={`distribution-media-type-${index}`}>{distribution.media_type}</p>
                                            <p data-testid={`distribution-byte-size-${index}`}>{distribution.byte_size} bytes</p>
                                            <p>
                                                <a href={distribution.download_url} target="_blank" data-testid={`distribution-download-url-${index}`}>{distribution.download_url}</a>
                                            </p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel> }
        </>
    );
}
