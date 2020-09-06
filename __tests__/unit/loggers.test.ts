import nock from "nock";
import payload from "../data/IssueCreatedPayload";
import { setTracker, checkTracker } from "../../models/loggers";
import config from "../../config";

nock.disableNetConnect();

const { monitoredTagPayload, closesTagPayload, noTagPayload } = payload;

const { number } = monitoredTagPayload.issue;
const { full_name: fullName } = monitoredTagPayload.repository;
const [owner, repo] = fullName.split("/");

describe("Test the checkTracker function", () => {
  test("Test if the functions retuns true for all tokens", () => {
    Object.values(config.tokens).forEach((token) => {
      const comment = `This comment have the ${token} token`;
      expect(checkTracker(comment)).toBeTruthy();
    });
  });
  test("Test if checkTracker returns false if no token is found", () => {
    const comment = `This comment don't have any token`;
    expect(checkTracker(comment)).toBeFalsy();
  });
});

describe("Test the setTrack function", () => {
  test("The function has to have 2 arguments, one for type(issue or pr) and other for hook", () => {
    expect(setTracker.length).toBe(2);
  });

  test("Test if when a issue is created with the monitored tag, the fuction send a patch request to github", async () => {
    nock("https://api.github.com")
      .patch(`/repos/${owner}/${repo}/issues/${number}`)
      .reply(200);

    await setTracker(closesTagPayload, "issue");
    // console.error("pending mocks: %j", nock.pendingMocks());
    expect(nock.isDone()).toBeTruthy();
  });

  test("Test if when a issue is created with the closes tag, the fuction send a patch request to github", async () => {
    nock("https://api.github.com")
      .patch(`/repos/${owner}/${repo}/issues/${number}`)
      .reply(200);

    await setTracker(monitoredTagPayload, "issue");

    expect(nock.isDone()).toBeTruthy();
  });
  test("Test if when a issue is created without any tag, the function don't send any http request", async () => {
    nock("https://api.github.com")
      .patch(`/repos/${owner}/${repo}/issues/${number}`)
      .reply(200);

    await setTracker(noTagPayload, "issue");

    expect(nock.isDone()).toBeFalsy();
  });
});
