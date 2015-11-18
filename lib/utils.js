'use strict';

var getAllTables = 'SELECT TABLE_NAME FROM information_schema.tables ' +
                   'WHERE table_schema = \'public\';';

var getAllSequences = 'SELECT sequence_name FROM information_schema.sequences;';

var deprecatedMsg = '(postgres-cleaner)DEPRECATED: "clean(db, done)" should ' +
                    'be "clean(options, db, done)"';

function validOptions(options) {
  if (!options.type) throw new Error('"type" option is required');

  return true;
}

module.exports = {
  queries: {
    getAllTables: getAllTables,
    getAllSequences: getAllSequences
  },
  deprecatedMsg: deprecatedMsg,
  validOptions: validOptions
};
