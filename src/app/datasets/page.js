"use client"
import { useState } from 'react';

import request from "@/utils/request/request"

import List from "../../components/list/List"
import { TextInput, Button } from "author-design-system-react"
import { mapListItems } from './mapper';

export default function Datasets() {
    const [search, setSearch] = useState("");
    const [items, setItems] = useState([]);

    const handleSubmit = async() => {
        const datasets = await request(`/api/datasets?q=${search}`)
        setItems(datasets)
    }

    const listItems = mapListItems(items)
    return (
        <>
            <h1 className="ons-u-fs-xxxl">Find a dataset</h1>
            <div className="ons-u-mb-m">
            <TextInput inputMode="text" onChange={e => setSearch(e.target.value)} value={search} width="350"
                label={{description: 'Search by title or ID e.g. "Consumer prices" or "CPIH01"',text: 'Search datasets'}} 
                name="dataset-search"
            />
            </div>
            <Button onClick={handleSubmit} text="Submit" />
            <div className="ons-u-mt-l ons-u-mb-l">
                <List items={listItems}/>
            </div>
        </>
    );
}