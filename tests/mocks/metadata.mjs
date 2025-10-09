export const metadataList = {
    items: [
        {
            "alerts": [
                {
                    "date": "2025-01-26T08:00:00.000Z",
                    "description": "This is an alert for version 1",
                    "type": "alert"
                },
                {
                    "date": "2025-01-26T09:00:00.000Z",
                    "description": "This is a correction for version 1",
                    "type": "correction"
                }
            ],
            "contacts": [
                {
                    "email": "cpi@ons.gov.uk",
                    "name": "Consumer Price Inflation team",
                    "telephone": "+44 1633 456900"
                },
                {
                    "email": "contact@ons.gov.uk",
                    "name": "Contact Two",
                    "telephone": "+44 1633 456901"
                }
            ],
            "description": "Measures of monthly UK inflation data including the Consumer Prices Index including owner occupiers’' housing costs (CPIH), Consumer Prices Index (CPI) and Retail Prices Index (RPI). These tables complement the consumer price inflation time series dataset.",
            "distributions": [
                {
                    "title": "Full Dataset (CSV)",
                    "format": "csv",
                    "media_type": "text/csv",
                    "download_url": "http://localhost:23600/downloads-new/datasets/RM086/editions/2021/versions/1.csv",
                    "byte_size": 4300000
                },
                {
                    "title": "Full Dataset (XLS)",
                    "format": "xls",
                    "media_type": "application/vnd.ms-excel",
                    "download_url": "http://localhost:23600/downloads-new/datasets/RM086/editions/2021/versions/1.xls",
                    "byte_size": 265000
                }
            ],
            "keywords": [
                "keyword",
                "keyword 2"
            ],
            "last_updated": "2025-02-26T16:17:24.451Z",
            "license": "Open Government Licence v3.0",
            "national_statistic": true,
            "next_release": "tomorrow",
            "qmi": {
                "href": "https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/deaths/methodologies/childmortalitystatisticsqmi"
            },
            "release_date": "2025-01-26T07:00:00.000Z",
            "title": "Consumer price inflation tables",
            "usage_notes": [
                {
                    "note": "This is a usage note for version 1",
                    "title": "Usage Note 1"
                },
                {
                    "note": "This is another usage note for version 1",
                    "title": "Usage Note 2"
                }
            ],
            "quality_designation": "accredited-official",
            "topics": [
                "topic-0",
                "topic-1"
            ],
            "links": {
                "self": {
                    "href": "http://dp-dataset-api:22000/datasets/mock-quarterly/editions/time-series/versions/1/metadata"
                },
                "version": {
                    "href": "http://dp-dataset-api:22000/datasets/mock-quarterly/editions/time-series/versions/1",
                    "id": "1"
                },
                "website_version": {
                    "href": "http://dp-frontend-router:20000/datasets/mock-quarterly/editions/time-series/versions/1"
                }
            },
            "edition": "time-series",
            "edition_title": "This is an edition title for version 1",
            "id": "mock-quarterly",
            "publisher": {
                "href": "https://www.ons.gov.uk",
                "name": "ONS"
            },
            "state": "published",
            "type": "static",
            "version": "1"
        },
        {
            "distributions": [
                {
                    "title": "Full Dataset (CSV)",
                    "format": "csv",
                    "media_type": "text/csv",
                    "download_url": "http://localhost:23600/downloads-new/datasets/RM086/editions/2021/versions/1.csv",
                    "byte_size": 4300000
                }
            ],
            "state": "approved",
            "last_updated": "2025-02-26T16:17:24.451Z",
            "release_date": "2025-01-26T07:00:00.000Z",
            "edition": "time-series",
            "edition_title": "This is an edition title for version 2",
            "id": "mock-minimal",
            "version": "2"
        }
    ]
};
