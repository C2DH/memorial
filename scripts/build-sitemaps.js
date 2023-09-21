/** Node script to generate a sitemap.xml  */
const yargs = require('yargs')
const debug = require('debug')('build-sitemaps')
const dotenv = require('dotenv')
const fs = require('fs')

const argv = require('./utils/parse-args')

debug('generate index sitemap ... dest:', argv.dest, process.env.NODE_ENV)
