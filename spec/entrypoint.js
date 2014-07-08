var tests = [];
for (var file in window.__karma__.files) {
  if (/\.spec\.js$/.test(file)) {
    tests.push(file);
  }
}

require.config({
  // Karma serves files from '/base'
  baseUrl: '/base/lib',

  paths: {
    //'underscore': '../node_modules/underscore/underscore'
  },

  shim: {
    // 'underscore': {
    //   exports: '_'
    // }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
