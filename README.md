# Baskerville
###### Sir Arthur Conan Doyle's The Hound of the User Agent
[![Build Status](https://api.travis-ci.org/kmdavis/baskerville.png?branch=master)](https://travis-ci.org/kmdavis/baskerville)
[![Coverage Status](https://coveralls.io/repos/kmdavis/baskerville/badge.png)](https://coveralls.io/r/kmdavis/baskerville)
[![Dev Dependencies](https://david-dm.org/kmdavis/baskerville/dev-status.svg)](https://david-dm.org/kmdavis/baskerville#dev-badge-embed)

Usage
=====

Baskerville will sniff a user agent string and provide some analysis of what it
might mean. Baskerville has 2 main methods: `tokenize`, and `process`.

Tokenize will return an array of tokens, for example:

```js
baskerville.tokenize('Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu');
```

will return the following tokens:

```js
[
  {
    name: 'compatible'
  },
  {
    name: 'en_US'
  },
  {
    name: 'KHTML',
    version: '4.4.3',
    like: 'Gecko'
  },
  {
    name: 'Konqueror',
    version: '4.4'
  },
  {
    name: 'Kubuntu'
  },
  {
    name: 'Linux',
    version: '2.6.32-22-generic'
  },
  {
    name: 'Mozilla',
    version: '5.0'
  },
  {
    name: 'X',
    version: '11'
  }
]
```

Process takes that array of tokens and does a little... processing... on it.

```js
baskerville.process(baskerville.tokenize('Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu'));
```

will return:

```js
[
  {
    name: 'compatible'
  },
  {
    name: 'en_US'
  },
  {
    type: 'browser',
    name: 'KHTML',
    version: '4.4.3',
    like: 'Gecko'
  },
  {
    type: 'browser',
    name: 'Konqueror',
    version: '4.4'
  },
  {
    type: 'os',
    name: 'Kubuntu'
  },
  {
    type: 'os',
    name: 'Linux',
    version: '2.6.32-22-generic'
  },
  {
    type: 'browser',
    name: 'Mozilla',
    version: '5.0'
  },
  {
    name: 'X',
    version: '11'
  }
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
baskerville.registerProcessor(function wrapVersions (token) {
  if (token.version) {
    token.version = new Version(token.version);
  }
});
```

Or you could parse the locale token ("en_US" in the example above):

```js
var carmen = require('carmen'); // https://github.com/kmdavis/carmen
baskerville.registerProcessor(function identifyLocale (token) {
  var locale = carmen.parse(token.name); // will return undefined if it can't parse
  if (locale) {
    token.type = 'locale';
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

Contributing
============

While there is an RFC ([RFC-2616](http://tools.ietf.org/html/rfc2616)) that
governs user agents, it's not exactly the best guide available. As such, there
are almost certainly some edge cases that fall through the cracks. If you find
one please create an issue, including the ENTIRE user agent string.

We use grunt for running tests and such, so, if you want to contribute, you'll
want to install grunt's cli `sudo npm install -g grunt-cli`. Once you have done
so, you can run any of our grunt tasks: `grunt watch`, `grunt test`, `grunt build`,
`grunt release:(major or minor or patch)`

License
=======

Copyright 2014 Kevan Davis.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
