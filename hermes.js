#!/usr/bin/env node
const cli = require('caporal')
const meta = require('./package.json')

cli
  .version(meta.version)
  .description(meta.description)

cli
  .command('viewport', 'Starts a Hermes viewport test')
  .argument('[links]', 'List of links to be tested (comma separated)', cli.LIST)
  .option('-l, --links-file <path-to-json>', 'Path to a json containing the links to be tested', (opt) => { if (typeof opt !== 'string') { throw new Error('Path must be a string') } return opt }, './screenshots')
  .option('-o, --output <path>', 'Output path for the screenshots', (opt) => { if (typeof opt !== 'string') { throw new Error('Path must be a string') } return opt }, './screenshots')
  .option('-v, --viewports-file <path-to-json>', 'Path to a viewport configuration file', (opt) => { if (typeof opt !== 'string') { throw new Error('Path must be a string') } return opt })
  .action(require('./src/commands/test-viewport.command'))

cli.parse(process.argv)
