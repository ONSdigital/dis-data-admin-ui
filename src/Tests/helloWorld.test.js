//src/components/__tests/example.test.js
import { test, expect } from "vitest";

function helloWorld() {
  return "Hello World"
}

test("Hello World", () => {
  expect(helloWorld()).toEqual("Hello World");
});