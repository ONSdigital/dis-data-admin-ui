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

test("onFileError sets the correct state ", () => {
    const msg = "Test error";
    const onError = jest.fn();
    expect(onError.mock.calls).toHaveLength(0);

    onFileError(msg, onError);
    expect(onError.mock.calls).toHaveLength(1);
    expect(onError.mock.calls[0][0]).toBe("Test error");
});

test("onFileSuccess sets the correct state ", () => {
    const mockFile = {
        relativePath: "test-directory/test-file-01.csv",
    };
    const onSuccess = jest.fn();
    expect(onSuccess.mock.calls).toHaveLength(0);

    onFileSuccess(mockResumable, mockFile, onSuccess);
    expect(onSuccess.mock.calls).toHaveLength(1);
    expect(onSuccess.mock.calls[0][0]).toBe("test-path/test-directory/test-file-01.csv");
});
