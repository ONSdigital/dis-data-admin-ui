"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'

import request from "@/utils/request/request"

import { TextInput } from "author-design-system-react"

export default function Dataset() {
    const { id, editionID, versionID } = useParams()
    const [response, setResponse] = useState(null);


    useEffect(() => {
        fetchData()
    }), [];

    const fetchData = async() => {
        if (!response) {
            const resp = await request(`/api/getall?datasetID=${id}&editionID=${editionID}&versionID=${versionID}`)
            setResponse(resp);
        }
    }

    if (!response) return false
    return (
        <>
            <div className="ons-u-fs-m ons-u-mt-s ons-u-pb-xxs" style={{"color":"#707071"}}>Version</div>
            <h1 className="ons-u-fs-xxxl">{response.dataset.title}: {response.edition.edition} (Version: {versionID})</h1>
            <p>View or edit a version.</p>

            <TextInput inputMode="text" value={response.dataset.title} width={800} label={{text: 'Dataset name'}} name="dataset-search" />

            <TextInput inputMode="text" value={response.version.release_date} width={800} label={{text: 'Release date'}} name="dataset-search" />

            <TextInput inputMode="text" value={response.version.release_date} width={800} label={{text: 'Next release'}} name="dataset-search" />

            <p className="ons-u-mt-s ons-u-mb-xs"><strong>Description</strong></p>

            <textarea rows="10" cols="100" defaultValue={response.dataset.description}></textarea>

        </>
    );
}