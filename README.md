![GitHub Workflow Status](https://img.shields.io/github/workflow/status/blazing-edge-labs/node-postgres-cleaner/Postgres%20Cleaner%20CI?style=for-the-badge) ![Coveralls](https://img.shields.io/coveralls/github/blazing-edge-labs/node-postgres-cleaner?style=for-the-badge)

Postgres Cleaner
========================
Extremely simple way to clean your postgres database.

You need to clean database after your test cases, you can do it simply with only one call.

Supported Databases
-------------------
* Postgres

Instalation
-----------
```shell
$ npm install postgres-cleaner
```

Usage
------
```javascript
var cleaner = require('postgres-cleaner')

var options = {
  type: 'delete',
  skipTables: ['SequelizeMeta'],
}

// db      - database connection object
// options - cleaner options
cleaner(options, db)
  .then()
  .catch()
```

Options
-------
    type         - 'truncate' - DEFAULT: use truncate to clear all tables in database
                                and restart sequences
                 - 'delete'   - use delete to clear all tables and restart all
                                sequences in database


    [skipTables] - array of tables to skip deleting from

What should I use?

Truncate should be faster so we use truncate as a default behaviour if type is not provided. Use delete if you have a specific reason to use delete. You can read more about the differences [here](https://stackoverflow.com/questions/139630/whats-the-difference-between-truncate-and-delete-in-sql).


Using pg-promise
-------------
This lib expects pg database connection object. pg-promise does some further checks so to make it work use pg from pg-promise.

```javascript
var pgp = require('pg-promise')({
    // Initialization Options
})

var db = pgp.pg.Pool({
  connectionString: 'postgres://your:database@localohost/string'
})

cleaner(options, db)
  .then()
  .catch()
```
