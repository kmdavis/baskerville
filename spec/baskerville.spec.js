define(['baskerville'], function (baskerville) {
  describe('Baskerville', function () {
    var
      expectedTokens = [
        {
          userAgent: 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
          tokens: [
            {
              name: '.NET CLR',
              version: '2.0.50727'
            },
            {
              name: '.NET CLR',
              version: '3.0.4506.2152'
            },
            {
              name: '.NET CLR',
              version: '3.5.30729'
            },
            {
              name: '3gpp-gba'
            },
            {
              name: 'compatible'
            },
            {
              name: 'InfoPath',
              version: '2'
            },
            {
              name: 'Mozilla',
              version: '5.0'
            },
            {
              name: 'MSIE',
              version: '10.6'
            },
            {
              name: 'SLCC',
              version: '1'
            },
            {
              name: 'Trident',
              version: '5.0'
            },
            {
              name: 'UNTRUSTED',
              version: '1.0'
            },
            {
              name: 'Windows NT',
              version: '6.1'
            }
          ]
        },
        {
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko ) Version/5.1 Mobile/9B176 Safari/7534.48.3',
          tokens: [
            {
              name: 'AppleWebKit',
              version: '534.46'
            },
            {
              name: 'CPU OS',
              version: '5_1',
              like: 'Mac OS X'
            },
            {
              name: 'iPad'
            },
            {
              name: 'KHTML',
              like: 'Gecko'
            },
            {
              name: 'Mobile',
              version: '9B176'
            },
            {
              name: 'Mozilla',
              version: '5.0'
            },
            {
              name: 'Safari',
              version: '7534.48.3'
            },
            {
              name: 'Version',
              version: '5.1'
            }
          ]
        },
        {
          userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_0_1 like Mac OS X; fr-fr) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5G77 Safari/525.20+',
          tokens: [
            {
              name: 'AppleWebKit',
              version: '525.18.1'
            },
            {
              name: 'CPU iPhone OS',
              version: '2_0_1',
              like: 'Mac OS X'
            },
            {
              name: 'fr-fr'
            },
            {
              name: 'iPhone'
            },
            {
              name: 'KHTML',
              like: 'Gecko'
            },
            {
              name: 'Mobile',
              version: '5G77'
            },
            {
              name: 'Mozilla',
              version: '5.0'
            },
            {
              name: 'Safari',
              version: '525.20+'
            },
            {
              name: 'U'
            },
            {
              name: 'Version',
              version: '3.1.1'
            }
          ]
        },
        {
          userAgent: 'Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu',
          tokens: [
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
        },
        {
          userAgent: 'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02',
          tokens: [
            {
              name: 'Android',
              version: '4.1'
            },
            {
              name: 'en-US'
            },
            {
              name: 'Linux'
            },
            {
              name: 'Opera',
              version: '12.02'
            },
            {
              name: 'Opera Mobi',
              version: 'ADR-1111101157'
            },
            {
              name: 'Presto',
              version: '2.9.201'
            },
            {
              name: 'U'
            },
            {
              name: 'Version',
              version: '12.02'
            }
          ]
        }
      ],
      expectedProcessing = [
        {
          token: {
            name: 'Firefox',
            version: '21.0'
          },
          result: {
            name: 'Firefox',
            type: 'browser',
            version: '21.0'
          }
        },
        {
          token: {
            name: 'CPU iPhone OS',
            version: '2_0_1',
            like: 'Mac OS X'
          },
          result: {
            name: 'CPU iPhone OS',
            type: 'os',
            version: '2.0.1',
            like: 'Mac OS X'
          }
        },
        {
          token: {
            name: 'N'
          },
          result: {
            type: 'security',
            name: 'N',
            value: 'none'
          }
        },
        {
          token: {
            name: 'U'
          },
          result: {
            type: 'security',
            name: 'U',
            value: 'strong'
          }
        },
        {
          token: {
            name: 'I'
          },
          result: {
            type: 'security',
            name: 'I',
            value: 'weak'
          }
        }
      ];

    describe('tokenizing', function () {
      expectedTokens.forEach(function (entry) {
        it('should parse "' + entry.userAgent + '" to an array of tokens', function () {
          expect(baskerville.tokenize(entry.userAgent)).toEqual(entry.tokens);
        });
      });
    });

    describe('processing', function () {
      expectedProcessing.forEach(function (entry) {
        it('should process "' + entry.token.name + '"', function () {
          expect(baskerville.process([entry.token])[0]).toEqual(entry.result);
        });
      });
    });

    describe('custom processing', function () {
      it('should process a token based on a custom processor', function () {
        expect(baskerville.process({ name: 'en-US' })).toEqual({
          name: 'en-US'
        });

        baskerville.registerProcessor(function identifyLocaleToken (token) {
          // simplified RFC-4646 regex
          if (/^(?:[a-z]{1,3})(?:[_-][a-zA-Z\d]{1,8})*$/.test(token.name)) {
            token.type = 'locale';

            return true;
          }
        });

        expect(baskerville.process({ name: 'en-US' })).toEqual({
          type: 'locale',
          name: 'en-US'
        });
      });
    });
  });
});