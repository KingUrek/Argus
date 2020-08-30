import webhooks from '../services/webhook';
import Loggers from '../models/loggers';

/**
 * This function set all types of hooks that the application can receive.
 */
export default () => {
  // webhooks.on('*', ({ id, name, payload }) => {
  //   // console.log(payload);
  // });

  webhooks.on('pull_request.edited', ({ id, name, payload }) => {
    Loggers.setTracker(payload);
  });
  webhooks.on('pull_request.opened', ({ id, name, payload }) => {
    Loggers.setTracker(payload);
  });
};
