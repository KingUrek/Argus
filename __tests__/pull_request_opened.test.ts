import payloads from "./data/PrCreatedPayload";
import nock from "nock";
import Loggers from "../models/loggers";

nock.disableNetConnect();

const { rightPayload, wrongPayload } = payloads;

describe("Test if when a pull request hook is send, the function make a http request to github", () => {
  test("test if the request is made with the right payload", async () => {
    // Configure test
    const { number } = rightPayload.pull_request;
    const { full_name: fullName } = rightPayload.repository;
    const [owner, repo] = fullName.split("/");

    const scope = nock("https://api.github.com")
      .patch(`/repos/${owner}/${repo}/pulls/${number}`, ({ body }) => {
        return (
          body.includes("**(Monitored By Argus)**") && body.includes("$closes")
        );
      })
      .reply(200);

    await Loggers.setTracker(rightPayload);

    // if (!scope.isDone()) {
    //   console.error("pending mocks: %j", scope.pendingMocks());
    // }

    expect(nock.isDone()).toBeTruthy();
  });

  test("Test if the request is made with the wrong payload", async () => {
    // Configure test
    const { number } = wrongPayload.pull_request;
    const { full_name: fullName } = wrongPayload.repository;
    const [owner, repo] = fullName.split("/");

    const scope = nock("https://api.github.com")
      .patch(`/repos/${owner}/${repo}/pulls/${number}`)
      .reply(200);

    await Loggers.setTracker(wrongPayload);

    // if (!scope.isDone()) {
    //   console.error("pending mocks: %j", scope.pendingMocks());
    // }

    expect(nock.isDone()).toBeFalsy();
  });
});

