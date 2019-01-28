'use strict'

const util = require('util')

module.exports = util.promisify(util.promisify(require('./lib/cleaner')))
