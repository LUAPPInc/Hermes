# Hermes

> A simple lightweight and straightforward browser testing tool

<center>

![Terminal](https://media.giphy.com/media/l3fzRphJSNh8vNA5i/giphy.gif)

</center>


<!-- TOC -->

- [Hermes](#hermes)
  - [What is hermes?](#what-is-hermes)
  - [Usage](#usage)
    - [Viewport Test](#viewport-test)
    - [Configuration](#configuration)
      - [Example script](#example-script)

<!-- /TOC -->

## What is hermes?

Hermes is a tool which came out of an simple Idea and problem: Testing viewport sizes for responsiveness.

> More awesome commands will come!

## Usage

First, install Hermes globally using either `yarn add @lunnarapps/hermes` or `npm i -g @lunnarapps/hermes`.

Typing `hermes` on your command line should bring this help text to your screen:

```sh
hermes 0.4.0 - Automated chromium-based scale browser testing

USAGE

  hermes viewport [links]

ARGUMENTS

  [links]      List of links to be tested (comma separated)      optional

OPTIONS

  -l, --links-file <path-to-json>           Path to a json containing the links to be tested      optional
  -o, --output <path>                       Output path for the screenshots                       optional default: "./screenshots"
  -vp, --viewports-file <path-to-json>      Path to a viewport configuration file                 optional

GLOBAL OPTIONS

  -h, --help         Display help
  -V, --version      Display version
  --no-color         Disable colors
  --quiet            Quiet mode - only displays warn and error messages
  -v, --verbose      Verbose mode - will also output debug messages
```

As of now, Hermes currently support a `viewport` command, which means that you can only use `hermes viewport [links]`.

### Viewport Test

Viewport testing means that Hermes navigates to all websites passed to it and then takes a screenshot of the browser in a desired size. The catch is: __Everything is defined by a JSON file__.

This means that you can have either a JSON file containing all URL's you're going to test or the `[links]` argument is a comma-separated list of URLs, such as `google.com, github.com, bing.com`. This list is optional, but if you ommit it, then the `-l` option becomes required. This options states a path where Hermes will be able to locate a JSON file with the following contents:

```json
[
  "URL1",
  "URL2",
  ...
]
```

This array will be used to apply a iterative test over all viewports one by one, in other words, this will navigate and print the browser screen at every configured viewport on the viewports file.

> As for now, Hermes does not resolve relative paths, so `./` and `../` will not work properly, please type the full pathname of the file

### Configuration

Hermes __needs__ a viewport file in JSON format to start testing. This file can be passed in the `-vp` option (look at the warning above) providing the path to it.

A viewports file is something like this:

```json
[
  {
    "name": "HD",
    "resolution": {
      "width": 1920,
      "height": 1080
    }
  },
  {
    "name": "8-5",
    "resolution": {
      "width": 1280,
      "height": 800
    }
  },
  {
    "resolution": {
      "width": 1024,
      "height": 768
    }
  },
  {
    "resolution": {
      "width": 800,
      "height": 600
    }
  }
]
```

> The property `name` can be omitted, 'No name' will be used instead

If nothing is passed, the above example will be the default viewport to be tested.

The `-o` tag is also necessary to output PNG files with the results of the test. This will take a full absolute path to output all the screenshots taken.

#### Example script

Running:

```sh
$ hermes viewport google.com,linkedin.com,fb.com -o <myOutputFolder>
```

Will produce a viewport test like this:

![Hermes](https://media.giphy.com/media/l3fzRphJSNh8vNA5i/giphy.gif)