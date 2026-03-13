export const editions = {
    count: 4,
    items: [ 
        {
            edition: "time-series",
            state: "published",
            edition_title: "Timeseries",
            release_date: "2025-01-26T07:00:00.000Z",
            distributions: [
                {
                    title: "Full Dataset (CSV)",
                    format: "csv",
                    media_type: "text/csv",
                    download_url: "http://localhost:23600/downloads/files/uuid-1/full-dataset.csv",
                    byte_size: 4300000
                },
                {
                    title: "Full Dataset (XLS)",
                    format: "xls",
                    media_type: "application/vnd.ms-excel",
                    download_url: "http://localhost:23600/downloads/files/uuid-2/full-dataset.xls",
                    byte_size: 265000
                }
            ]
        },
        {
            edition: "test-edition",
            state: "created",
            edition_title: "Test edition",
            release_date: "2025-05-25T07:00:00.000Z",
            distributions: [
                {
                    title: "Full Dataset (CSV)",
                    format: "csv",
                    media_type: "text/csv",
                    download_url: "http://localhost:23600/downloads/files/uuid-1/full-dataset.csv",
                    byte_size: 4300000
                },
                {
                    title: "Full Dataset (XLS)",
                    format: "xls",
                    media_type: "application/vnd.ms-excel",
                    download_url: "http://localhost:23600/downloads/files/uuid-2/full-dataset.xls",
                    byte_size: 265000
                }
            ]
        },
        {
            edition: "time-series-unpublished",
            state: "created",
            edition_title: "Time Series Unpublished",
            release_date: "2025-05-25T07:00:00.000Z",
            distributions: [
                {
                    title: "Full Dataset (CSV)",
                    format: "csv",
                    media_type: "text/csv",
                    download_url: "http://localhost:23600/downloads/files/uuid-1/full-dataset.csv",
                    byte_size: 4300000
                },
                {
                    title: "Full Dataset (XLS)",
                    format: "xls",
                    media_type: "application/vnd.ms-excel",
                    download_url: "http://localhost:23600/downloads/files/uuid-2/full-dataset.xls",
                    byte_size: 265000
                }
            ]
        },
        {
            edition: "test-id",
            state: "created",
            edition_title: "Test edition",
            release_date: "2025-05-25T07:00:00.000Z",
            distributions: [
                {
                    title: "Full Dataset (CSV)",
                    format: "csv",
                    media_type: "text/csv",
                    download_url: "http://localhost:23600/downloads/files/uuid-1/full-dataset.csv",
                    byte_size: 4300000
                },
                {
                    title: "Full Dataset (XLS)",
                    format: "xls",
                    media_type: "application/vnd.ms-excel",
                    download_url: "http://localhost:23600/downloads/files/uuid-2/full-dataset.xls",
                    byte_size: 265000
                }
            ]
        }
    ],
    limit: 20,
    offset: 0,
    total_count: 4
}