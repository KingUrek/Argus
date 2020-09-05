import payloads from "./data/PrClosedPayload";
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
    const issueNumber = 12 // This issue number comes from the mocked payload

    nock("https://api.github.com")
      .get(`/repos/${owner}/${repo}/issues/${issueNumber}`)
      .reply(200);

    nock("https://api.github.com")
      .post(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`)
      .reply(200);
    
      nock("https://api.github.com")
      .patch(`/repos/Mechanical-Men/novo-repo-das-crian-a/issues/${issueNumber}`)
      .reply(200);
    
    
      nock("https://api.github.com")
      .post(`/repos/${owner}/${repo}/issues/${number}/comments`)
      .reply(200);

    await Loggers.closeIssuewithLogger(rightPayload);

    // if (!scope.isDone()) {
    //   console.error("pending mocks: %j", scope.pendingMocks());
    // }

    expect(nock.isDone()).toBeTruthy();
  });
});
