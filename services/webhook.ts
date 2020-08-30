import { Webhooks } from '@octokit/webhooks';

require('dotenv').config();

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_GITHUB,
});

export default webhooks;
