import webhooks from '../services/webhook';
import Loggers from '../models/loggers';

/**
 * This function set all types of hooks that the application can receive.
 */
export default () => {
  // webhooks.on('*', ({  payload }) => {
  //   console.log(payload);
  // });

  webhooks.on('pull_request.edited', ({ payload }) => {
    Loggers.setTracker(payload);
  });

  webhooks.on('pull_request.opened', ({ payload }) => {
    Loggers.setTracker(payload);
  });

  webhooks.on('pull_request.closed', ({ payload }) => {
    Loggers.closeIssuewithLogger(payload);
  });
};
