import { Octokit } from '@octokit/core';

require('dotenv').config();

const octokit = new Octokit({ auth: process.env.TOKEN });

octokit.hook.after('request', async (response, options) => {
  // console.log(`${options.method} ${options.url}: ${response.status}`);
});

export default octokit;
