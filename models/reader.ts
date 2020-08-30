const fs = require('fs');
const pdf = require('pdf-parse');

const FILE_PATH = '/home/gabriel/Projetos/Github-trybe-bot/static/[APRENDIZAGEM - 1Ago20] Sprint 17 - Back End is Back (alright).pdf';
interface IAct {
  title:string, body:string
}
function parse(acc: IAct[], el: string) {
  if (+el[0]) {
    let [title, body] = el.split(':');
    [, title] = title.split('.');
    const act:IAct = {
      title, body: body.trim(),
    };
    return acc.concat(act);
  }

  acc[acc.length - 1].body += ` ${el}`;
  return acc;
}

async function getActions(filePath:string) {
  // TODO: Transformar o FILE_PATH em upload
  const dataBuffer = fs.readFileSync(filePath || FILE_PATH);

  const { text } = await pdf(dataBuffer);

  let lines = text.split('\n');
  const actions = [];
  let actionIndex;
  let actionFound;

  do {
    actionIndex = lines.findIndex((r:string) => r === 'Ações');
    lines = lines.slice(actionIndex + 1);
    const endIndex = lines.findIndex((r:string) => !r);
    actions.push(...lines.slice('_', endIndex));
    actionIndex = lines.slice(endIndex).findIndex((r:string) => r === 'Ações');
    actionFound = (actionIndex !== -1);
  } while (actionFound);
  return actions.reduce(parse, []);
}

module.exports = { getActions };
