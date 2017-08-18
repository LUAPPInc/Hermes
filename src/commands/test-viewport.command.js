const driver = require('puppeteer')
let spinner = require('ora')({ color: 'blue' })
const fs = require('fs')
const normalize = require('normalize-url')
let ssPath = null
let viewports = [
  {
    name: '16-9',
    resolution: {
      width: 1920,
      height: 1080
    }
  },
  {
    name: '8:5',
    resolution: {
      width: 1280,
      height: 800
    }
  },
  {
    name: 'iPad',
    resolution: {
      width: 768,
      height: 1024
    }
  }
]

async function takeSS (page, logger) {
  try {
    if (!fs.existsSync(ssPath)) fs.mkdirSync(ssPath)

    return page.screenshot({ path: `${ssPath}/${require('url').parse(page.url()).hostname}-${page.viewport().width}x${page.viewport().height}-${require('uuid/v4')().split('-')[0]}.png` })
  } catch (error) {
    logger.error(`There was an error taking the screenshot: ${error.message}`)
    return Promise.reject(error)
  }
}

function importFile (file) {
  try {
    return (file) ? JSON.parse(fs.readFileSync(file)) : null
  } catch (error) {
    throw new Error(`File ${file} must be a JSON`)
  }
}

function sanitizeURLs (urls) {
  try {
    if (!Array.isArray(urls)) throw new Error('URLs must be an array')

    return urls.map((url) => {
      return normalize(url)
    })
  } catch (error) {
    throw error
  }
}

async function command (args, options, logger) {
  logger.info('Starting viewport test')
  logger.debug('Setting configs')

  ssPath = options.output
  viewports = importFile(options.viewportsFile) || viewports
  const urls = sanitizeURLs(args.links || importFile(options.linksFile))

  logger.debug(`Output path set to: '${ssPath}'`)
  logger.debug(`Importing viewport config file: ${JSON.stringify(viewports)}`)
  logger.debug(`Importing links config file: ${JSON.stringify(urls)}`)

  logger.debug('Initializing browser')
  const browser = await driver.launch()

  try {
    logger.info(`Initializing viewport test for ${urls.length} URL`)
    for (let url of urls) {
      spinner.start(`Navigating to ${url}`)
      let page = await browser.newPage()

      await page.goto(url)
      spinner.info(`Navigated to ${url}`)

      for (let viewport of viewports) {
        spinner.start(`  -> Testing for ${viewport.resolution.width}x${viewport.resolution.height} [${viewport.name || 'No name'}]`)
        await page.setViewport(viewport.resolution)
        await takeSS(page, logger)
        spinner.succeed(`  -> Tested for ${viewport.resolution.width}x${viewport.resolution.height} [${viewport.name || 'No name'}]`)
      }
    }
  } catch (error) {
    logger.error(`There was an error executing your test: ${error.message}`)
    spinner.fail(error.message)
  } finally {
    browser.close()
  }
}

module.exports = command
