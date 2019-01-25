[![Build Status](https://travis-ci.org/blazing-edge-labs/node-postgres-cleaner.svg?branch=master)](https://travis-ci.org/blazing-edge-labs/node-postgres-cleaner) [![Coverage Status](https://coveralls.io/repos/github/blazing-edge-labs/node-postgres-cleaner/badge.svg?branch=master)](https://coveralls.io/github/blazing-edge-labs/node-postgres-cleaner?branch=master)

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
var cleaner = require('postgres-cleaner');

var options = {
  type: 'delete',
  skipTables: ['SequelizeMeta']
};

// db      - database connection object
// options - cleaner options
cleaner(options, db, callback);
```

Options
-------
    type         - 'delete'   - use delete to clear all tables and restart all
                                sequences in database
                 - 'truncate' - use truncate to clear all tables in database
                                and restart sequences

    [skipTables] - array of tables to skip deleting from

What should I use?

Truncate should be faster if you can use it. If you have relations in tables only delete
will work for you, so go with delete.

Running tests
-------------

```shell
$ yarn test
```

For tests you need postgres database running.


License:
--------

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
v
