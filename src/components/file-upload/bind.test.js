import { onFileAdded, onFileProgress, onFileError, onFileSuccess } from "./bind";

const uploadFunc = jest.fn();
const mockResumable = {
    upload: uploadFunc,
    opts: {
        query: {}
    }
};
const mockResumableOptions = {
    path: "test-path",
}

test("onFileAdded begins upload and sets correct state", () => {
    const onStart = jest.fn();
    expect(uploadFunc.mock.calls).toHaveLength(0);
    expect(onStart.mock.calls).toHaveLength(0);

    onFileAdded(mockResumable, mockResumableOptions, {}, onStart);
    expect(uploadFunc.mock.calls).toHaveLength(1);
    expect(onStart.mock.calls).toHaveLength(1);
});

test("onFileProgress sets the correct state ", () => {
    const progressFunc = jest.fn(() => 0.5);
    const mockFile = {
        progress: progressFunc
    };
    const updateState = jest.fn();
    expect(progressFunc.mock.calls).toHaveLength(0);
    expect(updateState.mock.calls).toHaveLength(0);

    onFileProgress(mockFile, updateState);
    expect(progressFunc.mock.calls).toHaveLength(1);
    expect(updateState.mock.calls).toHaveLength(1);
    expect(updateState.mock.calls[0][0]).toBe(50);
});

describe("onFileError sets the correct state ", () => {
    it("when JSON is returned from upload service", () => {
        const msg = `{"errors":[{"code":"DuplicateFile","description":"resource conflict: file already registered"}]}`;
        const onError = jest.fn();
        expect(onError.mock.calls).toHaveLength(0);

        onFileError(msg, onError);
        expect(onError.mock.calls).toHaveLength(1);
        expect(onError.mock.calls[0][0]).toMatchObject({id: "upload-error", text:"A file with this name already exists"})
    });

    it("when non JSON or broken JSON is returned from upload service", () => {
        const msg = "resource conflict: file already registered";
        const onError = jest.fn();
        expect(onError.mock.calls).toHaveLength(0);

        onFileError(msg, onError);
        expect(onError.mock.calls).toHaveLength(1);
        expect(onError.mock.calls[0][0]).toMatchObject({id: "upload-error", text:"resource conflict: file already registered"})
    });

    it("when an unrecoginised code is returned from upload service", () => {
        const msg = `{"errors":[{"code":"TestError","description":"test error"}]}`;
        const onError = jest.fn();
        expect(onError.mock.calls).toHaveLength(0);

        onFileError(msg, onError);
        expect(onError.mock.calls).toHaveLength(1);
        expect(onError.mock.calls[0][0]).toMatchObject({id: "upload-error", text:"test error"})
    });
});

test("onFileSuccess sets the correct state ", () => {
    const mockFile = {
        fileName: "test.csv",
        relativePath: "test-directory/test-file-01.csv",
        size: 1024,
        file: { 
            type: "csv"
        },
    };
    const onSuccess = jest.fn();
    expect(onSuccess.mock.calls).toHaveLength(0);

    onFileSuccess(mockResumable, mockFile, onSuccess);
    expect(onSuccess.mock.calls).toHaveLength(1);
    expect(onSuccess.mock.calls[0][0]).toStrictEqual({
        byte_size: 1024, 
        download_url: "test-path/test-directory/test-file-01.csv", 
        format: "csv",
        title: "test.csv"
    });
});
