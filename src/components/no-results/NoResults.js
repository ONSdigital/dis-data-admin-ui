import Link from "next/link";

export default function NoResults({ searchQuery, createURL }) {  
    return (
        <div className="ons-u-mt-l ons-u-mb-l">
            <p data-testid="no-results-message">We couldn't find anything matching your search term "<b>{searchQuery}</b>".</p>
            <p>A few things you could try:</p>
            <ul data-testid="no-results-list">
                <li>Check your spelling.</li>
                <li>Try an alternative search term.</li>
                <li>What you're looking for may not yet exist. 
                    {createURL && <Link href={createURL} data-testid="no-results-create-new-entry-link">Create a new entry</Link>}
                </li>
            </ul>
        </div>
    );
}
