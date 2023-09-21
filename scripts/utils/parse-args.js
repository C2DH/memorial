const yargs = require('yargs')
const debug = require('debug')('utils/parse-args')
const dotenv = require('dotenv')

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' })
  dotenv.config({ path: '.env.production.local' })
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' })
  dotenv.config({ path: '.env.development.local' })
}

dotenv.config() // load fallback .env file

debug('NODE_ENV', process.env.NODE_ENV) // eslint-disable-line no-console
debug('VITE_API_ENDPOINT', process.env.VITE_API_ENDPOINT) // eslint-disable-line no-console')
debug('VITE_LANGUAGES', process.env.VITE_LANGUAGES) // eslint-disable-line no-console

const argv = yargs
  .option('publicDir', {
    alias: 'p',
    describe: 'Destination directory for sitemap.xml',
    type: 'string',
    default: './public',
    // demandOption: true,
  })
  .option('buildDir', {
    alias: 'b',
    describe: 'Directory where built files are located',
    type: 'string',
    default: './build',
    // demandOption: true,
  })
  .option('langs', {
    alias: 'l',
    describe:
      'Languages to include from VITE_LANGUAGES env variable - to reduce overhead, comma separated',
    type: 'string',
    default: process.env.VITE_LANGUAGES,
  })
  .help()
  .alias('help', 'h').argv

// printout current args, variable by varaible
debug('argv.publicDir', argv.publicDir) // eslint-disable-line no-console
debug('argv.buildDir', argv.buildDir) // eslint-disable-line no-console

module.exports = argv
