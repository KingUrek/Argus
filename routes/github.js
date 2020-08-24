const router = require('express').Router();
const bodyParser = require('body-parser');
const issueController = require('../controllers/issues');

router.use(bodyParser.json());

router.post('/issue/close', issueController.closeIssues);

module.exports = router;
