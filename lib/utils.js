'use strict';

var _ = require('lodash');

var getAllTables = 'SELECT TABLE_NAME FROM information_schema.tables ' +
                  'WHERE table_schema = \'public\' ' +
                  'AND table_type = \'BASE TABLE\';';

var getAllSequences = 'SELECT sequence_name FROM information_schema.sequences' +
                       ' WHERE sequence_schema = \'public\';';

var deprecatedMsg = '(postgres-cleaner)DEPRECATED: "clean(db, done)" should ' +
                    'be "clean(options, db, done)"';

function _addSequnces(table) {
  return table + '_id_seq';
}

function validOptions(options) {
  if (!options.type) throw new Error('"type" option is required');

  if (!options.skipTables) options.skipTables = [];

  // determine what sequences to skip according to skipped tables
  options.skipSequences = _.map(options.skipTables, _addSequnces);

  return true;
}

function removeSkipped(list, key, skipped) {
  var trueList = _.map(list, key);
  return _(_.union(trueList, skipped)).uniq().xor(skipped).value();
}

module.exports = {
  queries: {
    getAllTables: getAllTables,
    getAllSequences: getAllSequences
  },
  deprecatedMsg: deprecatedMsg,
  validOptions: validOptions,
  removeSkipped: removeSkipped
};
