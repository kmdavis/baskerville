# Baskerville
> Sir Arthur Conan Doyle's The Hound of the User Agent

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

TODO

## Installation

```sh
npm install @kmdavis/baskerville
```

## Usage

Baskerville will sniff a user agent string and provide some analysis of what it
might mean. Baskerville has 2 main methods: `tokenize`, and `process`.

Tokenize will return an array of tokens, for example:

```js
import Baskerville from "@kmdavis/baskerville";
Baskerville.tokenize("Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu");
```

will return the following tokens:

```js
[
    {
        name: "compatible",
    },
    {
        name: "en_US",
    },
    {
        name: "KHTML",
        version: "4.4.3",
        like: "Gecko",
    },
    {
        name: "Konqueror",
        version: "4.4",
    },
    {
        name: "Kubuntu",
    },
    {
        name: "Linux",
        version: "2.6.32-22-generic",
    },
    {
        name: "Mozilla",
        version: "5.0",
    },
    {
        name: "X",
        version: "11",
    },
]
```

Process takes that array of tokens and does a little... processing... on it.

```js
Baskerville.process("Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu");
```

will return:

```js
[
    {
        name: "compatible",
    },
    {
        name: "en_US",
    },
    {
        type: "browser",
        name: "KHTML",
        version: "4.4.3",
        like: "Gecko",
    },
    {
        type: "browser",
        name: "Konqueror",
        version: "4.4",
    },
    {
        type: "os",
        name: "Kubuntu",
    },
    {
        type: "os",
        name: "Linux",
        version: "2.6.32-22-generic",
    },
    {
        type: "browser",
        name: "Mozilla",
        version: "5.0",
    },
    {
        name: "X",
        version: "11",
    },
]
```

The built-in processing is rather minimal: it will normalize version strings
(replacing underscores with dots), identify browsers and operating systems, and
the "security token" (N, U, or I). For additional processing, we expose a
`registerProcessor` method that allows you to create a processor plugin. For
example, you could use this to sort browsers or operating systems into buckets,
like mobile vs desktop, linux-based, etc. You could also use it to convert our
string versions into Version objects:

```js
Baskerville.registerProcessor(function wrapVersions (token) {
    if (token.version) {
        token.version = new Version(token.version);
    }
});
```

Or you could parse the locale token ("en_US" in the example above):

```js
var carmen = require("@kmdavis/carmen"); // https://github.com/kmdavis/carmen
Baskerville.registerProcessor(function identifyLocale (token) {
    var locale = carmen.parse(token.name); // will return undefined if it can't parse
    if (locale) {
        token.type = "locale";
        token.details = locale;
        return true; // We assume full ownership and responsibility for this token.
    }
    return false; // Let the other children play
});
```

In the example above, if a processor returns true, no further processing will be
performed on that token. Also, don't be scared to modify the token, you're not
modifying the original token, but rather a copy. The token or array of tokens
passed into baskerville.process is not modified in any way.

## Development setup

```sh
npm install
npm test
```

## Release History

* 0.1.0
    * Initial public release

## Meta

Kevan Davis <kevan.davis@me.com>

Distributed under the BSD license.

[https://github.com/kmdavis/baskerville](https://github.com/kmdavis/baskerville/)

## Contributing

1. Fork it (<https://github.com/kmdavis/baskerville/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/@kmdavis/baskerville.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@kmdavis/baskerville
[npm-downloads]: https://img.shields.io/npm/dm/@kmdavis/baskerville.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/kmdavis/baskerville/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/kmdavis/baskerville
