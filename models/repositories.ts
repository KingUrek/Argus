const axios = require('axios');
const userModel = require('./user');

const REPO_LINK = 'https://api.github.com/user/repos';

async function getRepositories(user:string, authenticated?:boolean) {
  if (authenticated) {
    userModel.authUser(user);
  }

  const options = userModel.authUser();

  try {
    const { data } = await axios.get(REPO_LINK, options);
    return data;
  } catch (error) {
    // TODO: Tratar erro de forma adequeada
    // eslint-disable-next-line no-console
    return console.log(error);
  }
}

module.exports = { getRepositories };
