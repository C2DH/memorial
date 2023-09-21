const debug = require('debug')('build-for-seo')
const fs = require('fs')

const argv = require('./utils/parse-args')

debug('generate index page, one per language:', argv.langs, process.env.NODE_ENV)
