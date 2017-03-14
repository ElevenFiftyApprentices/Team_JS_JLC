'use strict';

/**
 * Module dependencies
 */
var listsPolicy = require('../policies/lists.server.policy'),
  lists = require('../controllers/lists.server.controller');

module.exports = function(app) {
  // Lists Routes
  app.route('/api/lists').all(listsPolicy.isAllowed)
    .get(lists.list)
    .post(lists.create);

  app.route('/api/lists/:listId').all(listsPolicy.isAllowed)
    .get(lists.read)
    .put(lists.update)
    .delete(lists.delete);

  // Finish by binding the List middleware
  app.param('listId', lists.listByID);
};
