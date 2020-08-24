function authUser() {
  return {
    auth: {
      username: process.env.USERNAME,
      password: process.env.TOKEN || process.env.TOKEN,
    },
  };
}

module.exports = { authUser };
