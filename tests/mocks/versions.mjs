export const versions = {
    items: [
        {
            "edition": "time-series",
            "edition_title": "This is an edition title for version 1",
            "last_updated": {
                "$date": "2025-02-26T16:12:31.377Z"
            },
            "links": {
                "dataset": {
                    "href": "/datasets/mock-quarterly",
                    "id": "mock-quarterly"
                },
                "edition": {
                    "href": "/datasets/mock-quarterly/editions/time-series",
                    "id": "time-series"
                },
                "self": {
                    "href": "/datasets/mock-quarterly/editions/time-series/versions/1"
                },
                "version": {
                    "href": "/datasets/mock-quarterly/editions/time-series/versions/1",
                    "id": "1"
                }
            },
            "release_date": "2025-01-26T07:00:00.000Z",
            "state": "published",
            "usage_notes": [
                {
                    "title": "Usage Note 1",
                    "note": "This is a usage note for version 1"
                },
                {
                    "title": "Usage Note 2",
                    "note": "This is another usage note for version 1"
                }
            ],
            "alerts": [
                {
                    "type": "alert",
                    "date": "2025-01-26T08:00:00.000Z",
                    "description": "This is an alert for version 1"
                },
                {
                    "type": "correction",
                    "date": "2025-01-26T09:00:00.000Z",
                    "description": "This is a correction for version 1"
                }
            ],
            "version": 1,
            "type": "static",
            "quality_designation": "accredited-official",
            "distributions": [
                {
                    "title": "Full Dataset (CSV)",
                    "format": "csv",
                    "media_type": "text/csv",
                    "download_url": "/datasets/RM086/editions/2021/versions/1.csv",
                    "byte_size": 4300000
                },
                {
                    "title": "Full Dataset (XLS)",
                    "format": "xls",
                    "media_type": "application/vnd.ms-excel",
                    "download_url": "/datasets/RM086/editions/2021/versions/1.xls",
                    "byte_size": 265000
                }
            ]
        },
        {
            "edition": "time-series",
            "edition_title": "This is an edition title for version 2",
            "last_updated": {
                "$date": "2025-02-26T16:12:31.377Z"
            },
            "links": {
                "dataset": {
                    "href": "/datasets/static-test-dataset",
                    "id": "static-test-dataset"
                },
                "edition": {
                    "href": "/datasets/static-test-dataset/editions/time-series",
                    "id": "time-series"
                },
                "self": {
                    "href": "/datasets/static-test-dataset/editions/time-series/versions/2"
                },
                "version": {
                    "href": "/datasets/static-test-dataset/editions/time-series/versions/2",
                    "id": "2"
                }
            },
            "release_date": "2025-01-27T07:00:00.000Z",
            "state": "published",
            "usage_notes": [
                {
                    "title": "Usage Note 1",
                    "note": "This is a usage note for version 2"
                },
                {
                    "title": "Usage Note 2",
                    "note": "This is another usage note for version 2"
                }
            ],
            "alerts": [
                {
                    "type": "alert",
                    "date": "2025-01-27T08:00:00.000Z",
                    "description": "This is an alert for version 2"
                },
                {
                    "type": "correction",
                    "date": "2025-01-27T09:00:00.000Z",
                    "description": "This is a correction for version 2"
                }
            ],
            "version": 2,
            "type": "static",
            "quality_designation": "accredited-official",
            "distributions": [
                {
                    "title": "Full Dataset (CSV)",
                    "format": "csv",
                    "media_type": "text/csv",
                    "download_url": "/datasets/RM086/editions/2021/versions/2.csv",
                    "byte_size": 4300000
                },
                {
                    "title": "Full Dataset (XLS)",
                    "format": "xls",
                    "media_type": "application/vnd.ms-excel",
                    "download_url": "/datasets/RM086/editions/2021/versions/2.xls",
                    "byte_size": 265000
                }
            ]
        },
        {
            "edition": "time-series-unpublished",
            "edition_title": "This is an edition title for unpublished",
            "last_updated": {
                "$date": "2025-02-26T16:12:31.377Z"
            },
            "release_date": "2025-01-26T07:00:00.000Z",
            "state": "created",
            "version": 1,
            "type": "static",
        }
    ]
};
