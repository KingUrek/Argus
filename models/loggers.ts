/** This set of functions aims to give feedback to both users and developers */
import config from '../config';
import octokit from '../services/octokit';
import { closeIssue, findIssues } from '../models/issues';

/**
 * Checks if the pull_request must be tracked
 * @param {string} comment
 */
export function checkTracker(comment:string) {
  return comment.includes(config.token);
}

/** The `setTracker` function adds a call sign to the PR description to say that the pr is
* being monitored by the program
* @param {string} hook - The hook response from Github.
*/
export function setTracker(hook: any) {
  // TODO: Change the hooktype for a proper type
  try {
    const { body: comment, number } = hook.pull_request;
    const { full_name: fullName } = hook.repository;
    const [owner, repo] = fullName.split('/');
    const body = `${comment} **(Monitored By ${config.name})** `;
    if (checkTracker(comment) && !comment.includes(`(Monitored By ${config.name})`)) {
      octokit.request('PATCH /repos/:owner/:repo/pulls/:pull_number', {
        owner,
        repo,
        pull_number: number,
        body,
      });
    }
  } catch (error) {
    // TODO: Add a error handler
    console.error(error);
  }
}

/**
 * This function log on the PR and on the ISSUE that they are close by the automation.
 *
 */
export async function closeIssuewithLogger(payload:any) {
  try {
    // Get pull request information
    const PRNumber = payload.number;
    const { full_name: fullName } = payload.repository;
    const [owner, repo] = fullName.split('/');

    // Get issue to close information
    const { pull_request: pullRequest } = payload;
    const comment = pullRequest.body;
    if (comment.includes(config.token)) {
      const issues = (await findIssues(comment)).numbers;

      const issueData = await Promise.all(issues.map(async (issue: string) => {
        // Get issue Link
        const { html_url: issueLink, title } = (await octokit.request('GET /repos/:owner/:repo/issues/:issue_number', {
          owner,
          repo,
          issue_number: +issue,
        })).data;

        // Close Issue
        await closeIssue(issue);

        // Post a comment on the issue that was closed by automation
        const issueMessage = `Essa issUE foi fechada pela automatização ${config.name}`;
        await octokit.request('POST /repos/:owner/:repo/issues/:issue_number/comments', {
          owner,
          repo,
          issue_number: +issue,
          body: issueMessage,
        });

        return { issueLink, title };
      }));

      // Creates the message depending on how many issues exist.
      let message;
      if (issueData.length === 1) {
        message = `Esse PR fechou a [essa issue](${issueData[0].issueLink})`;
      } else {
        const issuesToJoin = issueData.map((issue) => `[${issue.title}](${issue.issueLink})`);
        message = `Esse PR fechou essas issues:\n ${issuesToJoin.join('\n')}`;
      }

      // Post a message on the PR that was closed.
      await octokit.request('POST /repos/:owner/:repo/issues/:issue_number/comments', {
        owner,
        repo,
        issue_number: PRNumber,
        body: message,
      });
    }
  } catch (error) {
    // TODO: Add a error handler
    console.error(error);
  }
}

export default { setTracker, checkTracker, closeIssuewithLogger };
