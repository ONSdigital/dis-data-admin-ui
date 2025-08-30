import { mapContentItems } from "./mapper";
import { datasetList } from "../../../../tests/mocks/datasets.mjs";

describe("mapContentItems", () => {
    test("returns expected object of mapped content items", () => {
        const mapped = mapContentItems(datasetList.items[2], "test/foo/edit", ["Topic Foo", "Topic Bar"]);
        const mappedItems = mapped[0].groups[0].rows;
        console.log(mappedItems[2].rowItems[0].actions)
        expect(mappedItems).toHaveLength(10);
        // expect "Series ID" to have single value and not have "edit" action
        expect(mappedItems[0].rowTitle).toBe("Series ID");
        expect(mappedItems[0].rowItems[0].valueList[0]).toMatchObject({text: "mock-quarterly"});
        expect(mappedItems[0].rowItems[0].actions).toBeFalsy();
        // expect "Type" to have single value and not have "edit" action
        expect(mappedItems[1].rowTitle).toBe("Type");
        expect(mappedItems[1].rowItems[0].valueList[0]).toMatchObject({text: "static"});
        expect(mappedItems[1].rowItems[0].actions).toBeFalsy();
        // expect "Title" to have single value and have "edit" action
        expect(mappedItems[2].rowTitle).toBe("Title");
        expect(mappedItems[2].rowItems[0].valueList[0]).toMatchObject({text: "Mock Dataset"});
        expect(mappedItems[2].rowItems[0].actions[0]).toMatchObject({
            id: "edit-title",
            visuallyHiddenText: "Edit Title",
            url: "test/foo/edit#dataset-series-title"
        });
        // expect "Description" to have single value and have "edit" action
        expect(mappedItems[3].rowTitle).toBe("Description");
        expect(mappedItems[3].rowItems[0].valueList[0]).toMatchObject({text: "This is a mock dataset test description"});
        expect(mappedItems[3].rowItems[0].actions[0]).toMatchObject({
            id: "edit-description",
            visuallyHiddenText: "Edit Description",
            url: "test/foo/edit#dataset-series-description"
        });
        // expect "Topics" to have two values and have "edit" action
        expect(mappedItems[4].rowTitle).toBe("Topics");
        expect(mappedItems[4].rowItems[0].valueList).toHaveLength(2)
        expect(mappedItems[4].rowItems[0].valueList[0]).toMatchObject({text: "Topic Foo"});
        expect(mappedItems[4].rowItems[0].valueList[1]).toMatchObject({text: "Topic Bar"});
        expect(mappedItems[4].rowItems[0].actions[0]).toMatchObject({
            id: "edit-topics",
            visuallyHiddenText: "Edit Topics",
            url: "test/foo/edit#dataset-series-topics"
        });
        // expect "Last updated" to have single value and have "edit" action
        expect(mappedItems[5].rowTitle).toBe("Last updated");
        expect(mappedItems[5].rowItems[0].valueList[0]).toMatchObject({text: "1 January 2000"});
        expect(mappedItems[5].rowItems[0].actions).toBeFalsy();
        // expect "Licence" to have single value and have "edit" action
        expect(mappedItems[6].rowTitle).toBe("Licence");
        expect(mappedItems[6].rowItems[0].valueList[0]).toMatchObject({text: "My License"});
        expect(mappedItems[6].rowItems[0].actions).toBeFalsy();
        // expect "Next release" to have single value and have "edit" action
        expect(mappedItems[7].rowTitle).toBe("Next release");
        expect(mappedItems[7].rowItems[0].valueList[0]).toMatchObject({text: "TBC"});
        expect(mappedItems[7].rowItems[0].actions).toBeFalsy();
        expect(mappedItems[8].rowTitle).toBe("Keywords");
        // expect "Keywords" to have two values and have "edit" action
        expect(mappedItems[8].rowItems[0].valueList).toHaveLength(2)
        expect(mappedItems[8].rowItems[0].valueList[0]).toMatchObject({text: "mock"});
        expect(mappedItems[8].rowItems[0].valueList[1]).toMatchObject({text: "test"});
        expect(mappedItems[8].rowItems[0].actions[0]).toMatchObject({
            id: "edit-keywords",
            visuallyHiddenText: "Edit Keywords",
            url: "test/foo/edit#dataset-series-keywords"
        });
        // expect "QMI" to have single value and have "edit" action
        expect(mappedItems[9].rowTitle).toBe("QMI");
        expect(mappedItems[9].rowItems[0].valueList[0]).toMatchObject({text: "https://www.ons.gov.uk/qmi"});
        expect(mappedItems[9].rowItems[0].actions[0]).toMatchObject({
            id: "edit-qmi",
            visuallyHiddenText: "Edit QMI",
            url: "test/foo/edit#dataset-series-qmi"
        });
    });
});

