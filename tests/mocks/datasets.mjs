const automatedDatasetList = () => {
    const list = [];
    for (let i = 0; i < 125; i++) {
        list.push(
            {
                "title": `Lorem ipsum dolor sit amet ${i}`,
                "description": `Consectetur adipiscing elit ${i}`,
                "id": `Pagination ${i}`
            },
        )
    }
    return list;
}

export const datasetList = {
    "items": [
        {
            "title": "Consumer prices",
            "description": "Something about consumer prices",
            "id": "cpih",
            "national_statistic": "false",
            "next_release": "TBC",
            "release_frequency": "Quarterly",
            "state": "published",
            "unit_of_measure": "Percentage",
            "topics": ["id1", "id2"],
            "last_updated": "2000-01-01T07:00:00.000Z",
            "license": "My License",
            "publisher": {
                "href": "https://www.ons.gov.uk",
                "name": "ONS"
            },
            "contacts": [
                {
                    "email": "contactOne@ons.gov.uk",
                    "name": "First Contact",
                    "telephone": "+44 1234 567891"
                },
                {
                    "email": "contactTwo@ons.gov.uk",
                    "name": "Second Contact",
                    "telephone": "+44 1234 567892"
                }
            ],
        },
        {
            "title": "Weekly deaths",
            "description": "Something about weekly deaths",
            "id": "weekly-deaths"
        },
        {
            "description": "This is a mock dataset test description",
            "id": "mock-quarterly",
            "keywords": ["mock", "test"],
            "national_statistic": "false",
            "next_release": "TBC",
            "release_frequency": "Quarterly",
            "state": "published",
            "title": "Mock Dataset",
            "unit_of_measure": "Percentage",
            "topics": ["id1", "id2"],
            "contacts": [
                {
                    "email": "contactOne@ons.gov.uk",
                    "name": "First Contact",
                    "telephone": "+44 1234 567891"
                },
                {
                    "email": "contactTwo@ons.gov.uk",
                    "name": "Second Contact",
                    "telephone": "+44 1234 567892"
                }
            ],
            "last_updated": "2000-01-01T07:00:00.000Z",
            "license": "My License",
            "publisher": {
                "href": "https://www.ons.gov.uk",
                "name": "ONS"
            },
            "qmi": {
                "href": "https://www.ons.gov.uk/qmi"
            },
            "type": "static",
            "next": {
                "description": "This is a mock dataset test description",
                "id": "mock-quarterly",
                "keywords": ["mock", "test"],
                "national_statistic": "false",
                "next_release": "TBC",
                "release_frequency": "Quarterly",
                "state": "published",
                "title": "Mock Dataset",
                "unit_of_measure": "Percentage",
                "topics": ["1000", "1001"],
                "contacts": [
                    {
                        "email": "contactOne@ons.gov.uk",
                        "name": "First Contact",
                        "telephone": "+44 1234 567891"
                    },
                    {
                        "email": "contactTwo@ons.gov.uk",
                        "name": "Second Contact",
                        "telephone": "+44 1234 567892"
                    }
                ],
                "last_updated": "2000-01-01T07:00:00.000Z",
                "license": "My License",
                "publisher": {
                    "href": "https://www.ons.gov.uk",
                    "name": "ONS"
                },
                "qmi": {
                    "href": "https://www.ons.gov.uk"
                },
                "type": "static",
            },
        },
        {
            "description": "This is a minimal mock dataset test description",
            "id": "mock-minimal",
            "title": "Minimal Mock Dataset",
            "topics": ["1000", "1003"],
            "contacts": [
                {
                    "email": "contactOne@ons.gov.uk",
                    "name": "First Contact"
                }
            ],
            "last_updated": "invalid/missing date",
            "license": "My Minimal License",
            "type": "static"
        },
        ...automatedDatasetList(),
        {
            "title": "Foobar test dataset",
            "description": "A test dataset",
            "id": "foo-bar"
          },
          {
            "next": {
              "title": "Test associated",
              "description": "A test dataset",
              "id": "test-publish-message-dataset",
              "state": "associated"
            },
            "current": {
              "title": "Test published",
              "description": "A test dataset",
              "id": "test-publish-message-dataset",
              "state": "published"
            }
          }
    ],
    "count": 20,
    "total_count": 130
}

