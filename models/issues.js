const axios = require('axios');
const { authUser } = require('./user');

const URL = 'https://api.github.com/repos/kingurek/adamchatroom/issues';
const ISSUE_URL = (number) => `https://api.github.com/repos/Mechanical-Men/novo/issues/${number}`;

async function createIssue({ title, body, milestone }) {
  try {
    const data = { title, body, milestone };

    const response = await axios.post(URL, data, authUser());
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getIssue(number) {
  const response = await axios.get(ISSUE_URL(number), authUser());
  return response.data;
}

async function closeIssue(number) {
  const body = {
    state: 'closed',
  };
  const response = await axios.patch(ISSUE_URL(number), body, authUser());
  return response.data;
}

module.exports = { createIssue, getIssue, closeIssue };
