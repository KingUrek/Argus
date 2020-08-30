const axios = require('axios');
const { authUser } = require('./user');

const URL = 'https://api.github.com/repos/kingurek/adamchatroom/issues';
const ISSUE_URL = (number:string) => `https://api.github.com/repos/Mechanical-Men/novo/issues/${number}`;

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

export async function closeIssue(issueId:string) {
  const body = {
    state: 'closed',
  };
  const response = await axios.patch(ISSUE_URL(issueId), body, authUser());
  return response.data;
}

export default { createIssue, getIssue, closeIssue };
