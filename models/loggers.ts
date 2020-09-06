/** This set of functions aims to give feedback to both users and developers */
import config from '../config';
import octokit from '../services/octokit';
import { closeIssue, findIssues } from '../models/issues';

/**
 * Checks if the pull request have a valid tracker token.
 * @param {string} comment
 */
export function checkTracker(comment: string):Boolean {
  // TODO: I don't like this functions, find a way to make it better

  const tokens = Object.values(config.tokens);
  return tokens.some((token) => comment.includes(token));
}

interface ItrackerType{
  'pullrequest':string,
  'issue':string
}

/** The `setTracker` function adds a call sign to the PR or issue description to say that that is
* been monitored by Argus.
* @params {any} hook : the github payload.
* @params type: the type of tracker ( PR or Issue )
*/
export async function setTracker(hook: any, type: keyof ItrackerType = 'pullrequest') {
  // TODO: Change the hooktype for a proper type
  // try {

  // Get if the type is pullrequest or issue
  let endpoint = 'PATCH /repos/:owner/:repo/pulls/:pull_number';
  let key = 'pull_request';
  let field = 'pull_number';
  if (type === 'issue') {
    endpoint = 'PATCH /repos/:owner/:repo/issues/:issue_number';
    key = 'issue';
    field = 'issue_number';
  }

  // Get information about the hook
  const { body: comment, number } = hook[key];
  const { full_name: fullName } = hook.repository;
  const [owner, repo] = fullName.split('/');

  const body = `${comment} **(Monitored By ${config.name})** `;

  if (checkTracker(comment) && !comment.includes(`(Monitored By ${config.name})`)) {
    await octokit.request(endpoint, {
      owner,
      repo,
      [field]: number,
      body,
    });
  }
  // } catch (error) {
  //   // TODO: Add a error handler
  //   console.error(error);
  // }
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
    if (comment.includes(config.tokens.close)) {
      const issues = (await findIssues(comment)).numbers;

      const issueData = await Promise.all(issues.map(async (issue: string) => {
        // Get issue Link
        // TODO: Para gerar o link da issue, provavelmente essa etapa
        // é apenas uma requisição extra e desnecessária.
        const { html_url: issueLink, title } = (await octokit.request('GET /repos/:owner/:repo/issues/:issue_number', {
          owner,
          repo,
          issue_number: +issue,
        })).data;

        // Close Issue
        await closeIssue(issue);

        // Post a comment on the issue that was closed by automation
        const issueMessage = `Essa issue foi fechada pela automatização ${config.name}`;
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
