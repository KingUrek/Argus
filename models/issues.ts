import config from '../config';
import octokit from '../services/octokit';

const axios = require('axios');
const { authUser } = require('./user');

const URL = 'https://api.github.com/repos/kingurek/adamchatroom/issues';
const ISSUE_URL = (number:string) => `https://api.github.com/repos/Mechanical-Men/novo/issues/${number}`;

class Issues {
  issues:RegExpExecArray[]

  constructor(issues:RegExpExecArray[]) {
    this.issues = issues;
  }

  get numbers() {
    return this.issues.map((issue) => issue[1]);
  }
}

export async function findIssues(phrase:string, regex = /\$closes (\d+)/gm) {
  let matchs;
  const issues = [];
  // eslint-disable-next-line no-cond-assign
  while (matchs = regex.exec(phrase)) {
    issues.push(matchs);
  }
  return new Issues(issues);
}

/**
 * This function closes a issue when the pull request is merged if the pull resquest is monitored
 */
// export async function closeIssue(hook:any) {
//   const { pull_request: pullRequest, action } = hook;
//   const comment = pullRequest.body;
//   if (comment.includes(config.token) && action === 'closed') {
//     const issues = (await findIssues(comment)).numbers;
//     issues.forEach(async (iNumber:string) => {
//       closeIssue(iNumber);
//     });
//   }
// }

interface ICreateIssue {
  title: string,
  body: string,
  milestone:string
}

export async function createIssue({ title, body, milestone }:ICreateIssue) {
  try {
    const data = { title, body, milestone };

    const response = await axios.post(URL, data, authUser());
    return response.data;
  } catch (error) {
    return error;
  }
}

export async function getIssue(issueId:string) {
  const response = await axios.get(ISSUE_URL(issueId), authUser());
  return response.data;
}

export async function closeIssue(issueNumber: string, owner = config.owner, repo = config.repo) {
  return octokit.request('PATCH /repos/:owner/:repo/issues/:issue_number', {
    owner,
    repo,
    issue_number: +issueNumber,
    state: 'closed',
  });
}

export default { createIssue, getIssue, closeIssue };
