/** This set of functions aims to give feedback to both users and developers */
import config from '../config';
import octokit from '../services/octokit';

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

export default { setTracker, checkTracker };
