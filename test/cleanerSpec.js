'use strict';

var should = require('should');
var cleaner = require('../lib/cleaner');
var async = require('async');

var dbHost = process.env.POSTGRES_HOST || 'localhost';

var pg = require('pg');
// increase pool size just for tests
pg.defaults.poolSize = 20;

// helper functions to be used with async to help making tests easier
function createDatabase(params) {
  return function(callback, results) {
    var q = 'CREATE DATABASE ' + params.database;
    results.connectPostgres[0].query(q, callback);
  };
}

function dropDatabase(params) {
  return function(callback, results) {
    var q = 'DROP DATABASE IF EXISTS ' + params.database;
    results.connectPostgres[0].query(q, callback);
  };
}

function createTable(params) {
  return function create(callback, results) {
    var q = 'CREATE TABLE ' + params.table +
      ' (id SERIAL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id));';
    results.connect[0].query(q, callback);
  };
}

function insertValue(params) {
  return function insert(callback, results) {
    var q = 'INSERT INTO ' + params.table + ' (name) VALUES (\'lorem1\');' +
            'INSERT INTO ' + params.table + ' (name) VALUES (\'lorem2\');';
    results.connect[0].query(q, callback);
  };
}

function checkEmptyTable(params) {
  return function check(callback, results) {
    var q = 'SELECT * FROM ' + params.table;
    results.connect[0].query(q, callback);
  };
}

function checkSequence(params) {
  return function check(callback, results) {
    var q = 'SELECT nextval(\'' + params.table + '_id_seq\');';
    results.connect[0].query(q, callback);
  }
}

function databaseCleanerDeprecated(callback, results) {
  cleaner(results.connect[0], callback);
}

function databaseCleaner(options) {
  return function(callback, results) {
    cleaner(options, results.connect[0], callback);
  }
}

function connect(params) {
  return function connection(callback) {
    var connectionString = 'postgres://postgres@' +
      dbHost  + '/' + params.database;
    pg.connect(connectionString, callback);
  };
}

describe('postgres', function() {

  before(function(done) {
    async.auto({
      connectPostgres: connect({database: 'postgres'}),
      dropDb: ['connectPostgres', dropDatabase({database: 'cleaner'})],
      createDb: ['dropDb', createDatabase({database: 'cleaner'})]
    }, done);
  });

  before(function(done) {
    async.auto({
      connect: connect({database: 'cleaner'}),
      create1: ['connect', createTable({table: 'table1'})],
      create2: ['connect', createTable({table: 'table2'})],
      create3: ['connect', createTable({table: 'table3'})]
    }, done);
  });

  beforeEach(function(done) {
    async.auto({
      connect: connect({database: 'cleaner'}),
      insert1: ['connect', insertValue({table: 'table1'})],
      insert2: ['connect', insertValue({table: 'table2'})],
      insert3: ['connect', insertValue({table: 'table3'})]
    }, done);
  });

  it('should delete all tables', function(done) {
    async.auto({
      connect: connect({database: 'cleaner'}),
      clean: ['connect', databaseCleaner({type: 'delete'})],
      check1: ['clean', checkEmptyTable({table: 'table1'})],
      check2: ['clean', checkEmptyTable({table: 'table2'})],
      check3: ['clean', checkEmptyTable({table: 'table3'})],
      checkSeq1: ['clean', checkSequence({table: 'table1'})],
      checkSeq2: ['clean', checkSequence({table: 'table2'})],
      checkSeq3: ['clean', checkSequence({table: 'table3'})]
    }, function(err, results) {
      if (err) throw(err);
      should(results.check1.rows.length).equal(0);
      results.check2.rows.length.should.equal(0);
      results.check3.rows.length.should.equal(0);
      results.checkSeq1.rows[0].nextval.should.equal('1');
      results.checkSeq2.rows[0].nextval.should.equal('1');
      results.checkSeq3.rows[0].nextval.should.equal('1');
      done();
    });
  });

  it('should delete all tables', function(done) {
    async.auto({
      connect: connect({database: 'cleaner'}),
      clean: ['connect', databaseCleaner({type: 'truncate'})],
      check1: ['clean', checkEmptyTable({table: 'table1'})],
      check2: ['clean', checkEmptyTable({table: 'table2'})],
      check3: ['clean', checkEmptyTable({table: 'table3'})],
      checkSeq1: ['clean', checkSequence({table: 'table1'})],
      checkSeq2: ['clean', checkSequence({table: 'table2'})],
      checkSeq3: ['clean', checkSequence({table: 'table3'})]
    }, function(err, results) {
      if (err) throw(err);
      should(results.check1.rows.length).equal(0);
      results.check2.rows.length.should.equal(0);
      results.check3.rows.length.should.equal(0);
      results.checkSeq1.rows[0].nextval.should.equal('1');
      results.checkSeq2.rows[0].nextval.should.equal('1');
      results.checkSeq3.rows[0].nextval.should.equal('1');
      done();
    });
  });

  it('should skip tables truncate', function(done) {
    async.auto({
      connect: connect({database: 'cleaner'}),
      clean: [
        'connect',
        databaseCleaner({type: 'truncate', skipTables: ['table1']})
      ],
      check1: ['clean', checkEmptyTable({table: 'table1'})],
      check2: ['clean', checkEmptyTable({table: 'table2'})],
      check3: ['clean', checkEmptyTable({table: 'table3'})],
      checkSeq1: ['clean', checkSequence({table: 'table1'})],
      checkSeq2: ['clean', checkSequence({table: 'table2'})],
      checkSeq3: ['clean', checkSequence({table: 'table3'})]
    }, function(err, results) {
      if (err) throw(err);
      should(results.check1.rows.length).equal(2);
      results.check2.rows.length.should.equal(0);
      results.check3.rows.length.should.equal(0);
      results.checkSeq1.rows[0].nextval.should.equal('4');
      results.checkSeq2.rows[0].nextval.should.equal('1');
      results.checkSeq3.rows[0].nextval.should.equal('1');
      done();
    });
  });

  it('should delete all tables deprecated', function(done) {
    async.auto({
      connect: connect({database: 'cleaner'}),
      clean: ['connect', databaseCleanerDeprecated],
      check1: ['clean', checkEmptyTable({table: 'table1'})],
      check2: ['clean', checkEmptyTable({table: 'table2'})],
      check3: ['clean', checkEmptyTable({table: 'table3'})],
      checkSeq1: ['clean', checkSequence({table: 'table1'})],
      checkSeq2: ['clean', checkSequence({table: 'table2'})],
      checkSeq3: ['clean', checkSequence({table: 'table3'})]
    }, function(err, results) {
      if (err) throw(err);
      should(results.check1.rows.length).equal(0);
      results.check2.rows.length.should.equal(0);
      results.check3.rows.length.should.equal(0);
      results.checkSeq1.rows[0].nextval.should.equal('1');
      results.checkSeq2.rows[0].nextval.should.equal('1');
      results.checkSeq3.rows[0].nextval.should.equal('1');
      done();
    });
  });

  it('should skip tables delete', function(done) {
    async.auto({
      connect: connect({database: 'cleaner'}),
      clean: [
        'connect',
        databaseCleaner({type: 'delete', skipTables: ['table3']})
      ],
      check1: ['clean', checkEmptyTable({table: 'table1'})],
      check2: ['clean', checkEmptyTable({table: 'table2'})],
      check3: ['clean', checkEmptyTable({table: 'table3'})],
      checkSeq1: ['clean', checkSequence({table: 'table1'})],
      checkSeq2: ['clean', checkSequence({table: 'table2'})],
      checkSeq3: ['clean', checkSequence({table: 'table3'})]
    }, function(err, results) {
      if (err) throw(err);
      should(results.check1.rows.length).equal(0);
      results.check2.rows.length.should.equal(0);
      results.check3.rows.length.should.equal(2);
      results.checkSeq1.rows[0].nextval.should.equal('1');
      results.checkSeq2.rows[0].nextval.should.equal('1');
      results.checkSeq3.rows[0].nextval.should.equal('4');
      done();
    });
  });

  it('should error cause of wrong type and options', function(done) {
    async.auto({
      connect: connect({database: 'cleaner'})
    }, function(err, results) {
      try {
        cleaner({type: 'wrong'}, results.connect[0], function() {});
      } catch (e) {
        e.message.should.eql('Unrecognized type: wrong');
      }
      try {
        cleaner({wrong: 'delete'}, results.connect[0], function() {});
      } catch (e) {
        e.message.should.eql('"type" option is required');
      }
      done();
    });
  });
});
