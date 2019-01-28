## 2018.01.28, Version 1.0.2

* update to work with latest pg

## 2018.01.26, Version 1.0.1

* Remove all dependencies

## 2018.01.26, Version 1.0.0

* BREAKING CHANGE: promise interface instead callback interface
* BREAKING CHANGE: dropped support for < node 8
* truncate is now default behaviour if type not provided

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
