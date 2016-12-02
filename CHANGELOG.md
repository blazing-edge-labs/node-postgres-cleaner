## 2016.12.01, Version 0.1.4

* cascade on truncate so truncate can be used with relations

## 2016.11.15, Version 0.1.3

* delete only tables from public schema to stop plugins from breaking

## 2015.11.18, Version 0.1.2

* fix trying to delete non existing sequence #4

## 2015.11.18, Version 0.1.1

* added skipTables option

## 2015.11.18, Version 0.1.0

* added options
* added option to pick from delete and truncate
* DEPRECATED: `clean(db, done)` should be `clean(options, db, done)`
