// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import config from '../config';
import { closeIssue } from '../models/issues';

class Issues {
  issues:RegExpExecArray[]

  constructor(issues:RegExpExecArray[]) {
    this.issues = issues;
  }

  get numbers() {
    return this.issues.map((issue) => issue[1]);
  }
}

function findIssues(phrase:string, regex = /\$closes (\d+)/gm) {
  let matchs;
  const issues = [];
  // eslint-disable-next-line no-cond-assign
  while (matchs = regex.exec(phrase)) {
    issues.push(matchs);
  }
  return new Issues(issues);
}

function closeIssues(req:Request) {
  // TODO: transformar o token de close para um token genérico que pode ser configurado
  const { pull_request: pullRequest, action } = req.body;
  const comment = pullRequest.body;
  if (comment.includes(config.token) && action === 'closed') {
    const issues = findIssues(comment).numbers;
    issues.forEach((iNumber) => {
      closeIssue(iNumber);
    });
  }
}

export default { closeIssues };
