const { closeIssue } = require('../models/issues');

class Issues {
  constructor(issues) {
    this.issues = issues;
  }

  get numbers() {
    return this.issues.map((issue) => issue[1]);
  }
}

function findIssues(phrase, regex = /\$closes (\d+)/gm) {
  let matchs;
  const issues = [];
  while (matchs = regex.exec(phrase)) {
    issues.push(matchs);
  }
  return new Issues(issues);
}

function closeIssues(req, res) {
  // TODO: transformar o token de close para um token genérico que pode ser configurado
  const { pull_request: pullRequest, action } = req.body;
  const comment = pullRequest.body;
  if (comment.includes('$closes') && action === 'closed') {
    const issues = findIssues(comment).numbers;
    issues.forEach((iNumber) => {
      closeIssue(iNumber);
    });
  }
}

module.exports = { closeIssues };
