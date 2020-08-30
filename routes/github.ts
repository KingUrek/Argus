import express from 'express';
import webhookConfig from '../controllers/webhooks';
import issueController from '../controllers/issues';
import webhooks from '../services/webhook';

const router = express.Router();
webhookConfig();

router.post('/', webhooks.middleware);
router.post('/issue/close', issueController.closeIssues);

module.exports = router;
