// ^ UMD stub
(function (root, factory) {
  if (typeof define === 'function' && define.amd) { // AMD

    define(['exports'/*, // begin dependencies list:
      'underscore'*/
    ], factory);
  } else if (typeof exports === 'object') { // CommonJS

    factory(exports/*, // begin dependencies list:
      require('underscore')*/
    );
  } else { // Browser globals

    factory((root.baskerville = {})/*, // begin dependencies list:
      root._*/
    );
  }
}(this,

function (exports, undefined) {

  /**
   * Parses an user agent string and returns an array of tokens, sorted by name.
   *
   * @public as "tokenize"
   * @method tokenizeUserAgent
   *
   * @param  {String} userAgent  An user agent string
   *
   * @return {Object[]}          A sorted array of tokens
   *
   * @example:
   *   baskerville.tokenize('Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu');
   */
  function tokenizeUserAgent (userAgent) {
    var
      tokens = [];

    userAgent
      .replace(IN_PARENS_EXTRACTOR, function (all, inParens) {
        var
          raw = inParens.split(IN_PARENS_SPLITTER),
          entry, tmp, i;

        for (i = 0; i < raw.length; i += 1) {
          tmp = raw[i].match(IN_PARENS_MATCHER);

          entry = {
            name: tmp[1]
          };

          if (tmp[2]) {
            entry.version = tmp[2];
          }

          if (tmp[3]) {
            entry.like = tmp[3];
          }

          tokens.push(entry);
        }

        return '';
      })
      .replace(OUT_PARENS_MATCHER, function (all, name, version, like) {
        var entry = {
          name: name
        };

        if (version) {
          entry.version = version;
        }

        if (like) {
          entry.like = like;
        }

        tokens.push(entry);
      });

    tokens.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      if (a.version.toLowerCase() < b.version.toLowerCase()) {
        return -1;
      } else if (a.version.toLowerCase() > b.version.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    return tokens;
  }

  /**
   * Makes a copy of a token.
   *
   * @private
   * @method  copyToken
   *
   * @param   {Object} token  A token
   *
   * @return  {Object}        A copy of a token
   */
  function copyToken (token) {
    var copy = {}, key;

    for (key in token) {
      copy[key] = token[key];
    }

    return copy;
  }

  /**
   * Invokes each step in a pipeline of processors until it either reaches the
   * end, or one of them returns true.
   *
   * @private
   * @method  processToken
   *
   * @param   {Object} token  A token
   *
   * @return  {Object}        A processed token
   */
  function processToken (token) {
    for (var i = 0, final = false; i < processors.length && !final; i += 1) {
      final = processors[i](token);
    }

    return token;
  }

  /**
   * Processes a token (or array of tokens), normalizing fields, identifying,
   * and decorating with additional fields. Processing is done by passing a copy
   * of each token thru a pipeline of processors, each of which is allowed to
   * modify the copy. If a processor returns true, processing for that token
   * will end.
   *
   * @public as "process"
   * @method processTokens
   *
   * @param  {Object|Object[]} tokens  A token or an array of tokens
   *
   * @return {Object|Object[]}         A processed token or array of processed tokens
   *
   * @example:
   *   baskerville.process(baskerville.tokenize('Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu'));
   */
  function processTokens (tokens) {
    var result, i;

    if (tokens instanceof Array) {
      result = [];

      for (i = 0; i < tokens.length; i += 1) {
        result.push(processToken(copyToken(tokens[i])));
      }
    } else {
      result = processToken(copyToken(tokens));
    }

    return result;
  }

  /**
   * Registers a processor. Each processor, in turn, is given a token, and is
   * permitted to modify that token. If the processor returns true, no further
   * processing will be performed on that token. In this way, a processor can
   * either behave as part of pipeline, identifying/normalizing what it can, or
   * it can take over and produce a final answer.
   *
   * @public
   * @method registerProcessor
   *
   * @param  {Function} processor  A processor
   *
   * @example:
   *   baskerville.registerProcessor(function identifyMobileDevices (token) {
   *     if (token.type === 'browser') {
   *       token.mobile = SOME_REGEX_OF_MOBILE_BROWSERS.test(token.name);
   *     } else if (token.type === 'os') {
   *       token.mobile = SOME_REGEX_OF_MOBILE_OPERATING_SYSTEMS.test(token.name);
   *     }
   *   });
   *
   * @example:
   *   var carmen = require('carmen'); // https://github.com/kmdavis/carmen
   *   baskerville.registerProcessor(function identifyLocale (token) {
   *     var locale = carmen.parse(token.name);
   *     if (locale) {
   *       token.type = 'locale';
   *       token.details = locale;
   *       return true; // We assume full ownership and responsibility for this token.
   *     }
   *     return false; // Let the other children play
   *   });
   */
  function registerProcessor (processor) {
    processors.push(processor);
  }

  var
    IN_PARENS_EXTRACTOR = new RegExp(
      '\\(' + // begin parens
        '(?!like)' + // ignore if it starts with "like", e.g. KHTML/4.4.3 (like Gecko)
        '(.*?)' + // extract this part
      '\\)', // end parens
      'g'
    ),
    IN_PARENS_SPLITTER = /;\s*/g,
    IN_PARENS_MATCHER = new RegExp(
      '(.+?)' + // lazily match anything, and save it -- this is the "name" field
      '[/. ]?' +
      '(' + // save the version
        '(?:\\w+-)?' + // versions can occasionally start with some text, e.g. ADR-1111101157, as long as that text is separated from the rest by a hyphen
        '\\d+' + // required to have at least 1 number
        '(?:[._-]?\\w)*' + // and a number of alphanumeric fields separated by a dot, underscore or hyphen
      ')?' + // yeah, version isn't actually required.
      '(?:,? like (.*?)\\s*)?$' // some tokens have a "like" comment, e.g. KHTML, like Gecko or CPU iPhone OS 2_0_1 like Mac OS X
    ),
    OUT_PARENS_MATCHER = new RegExp(
      '([\\w-]+)' + // here's our name field. unlike in parens, spaces are NOT allowed
      '(?:' +
        '/' + // name is separated from the version by a /
        '(\\S+)' + // our version field
      ')?' +
      '(?:\\s+\\(like\\s+(.*?)\\))?', // and the optional "like" comment
      'g'
    ),

    BROWSERS = /^applewebkit|camino|chrome|chromeframe|firefox|fluid|gecko|(?:ms)?ie|khtml|konqueror|mozilla|opera(?: mobi| mini)|presto|safari|trident$/i,
    OPERATING_SYSTEMS = /^android|beos|blackberry|cri?os|kubuntu|(?:freebsd|linux|openbsd)(?: \w*)?|macintosh|mac_powerpc|(?:intel|ppc)? ?mac os x|sunos|symbos|ubuntu|win(?:dows )?(?:95|98|nt|ce)?$/i,

    processors = [
      /**
       * Identifies the security token.
       *
       * @private
       * @method  processSecurityToken
       *
       * @param   {Object} token       A baskerville token
       * @param   {String} token.name  One of the letters N, U, or I
       *
       * @return  {Boolean}            Return true to prevent additional processing of this token
       */
      function processSecurityToken (token) {
        if (token.name.match(/^[NUI]$/)) {
          token.type = 'security';

          switch (token.name) {
            case 'N': token.value = 'none'; break;
            case 'U': token.value = 'strong'; break;
            case 'I': token.value = 'weak'; break;
          }

          return true;
        }
        return false;
      },

      /**
       * Normalizes a version field, if it exists.
       *
       * @private
       * @method  processVersionField
       *
       * @param   {Object} token            A baskerville token
       * @param   {String} [token.version]  A version field
       */
      function processVersionField (token) {
        if (token.version) {
          token.version = token.version.replace(/_/g, '.');
        }
      },

      /**
       * Identifies browsers.
       *
       * @private
       * @method  identifyBrowserTokens
       *
       * @param   {Object} token       A baskerville token
       * @param   {String} token.name  The name of the browser
       */
      function identifyBrowserTokens (token) {
        if (BROWSERS.test(token.name) || (token.like && BROWSERS.test(token.like))) {
          token.type = 'browser';
        }
      },

      /**
       * Identifies browsers.
       *
       * @private
       * @method  identifyOSTokens
       *
       * @param   {Object} token       A baskerville token
       * @param   {String} token.name  The name of the operating system
       */
      function identifyOSTokens (token) {
        if (OPERATING_SYSTEMS.test(token.name) || (token.like && OPERATING_SYSTEMS.test(token.like))) {
          token.type = 'os';
        }
      }
    ];

  exports.tokenize = tokenizeUserAgent;
  exports.process = processTokens;
  exports.registerProcessor = registerProcessor;

  exports.version = '@@version';
}));
