module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      src:   'lib/**/*.js',
      specs: 'spec/**/*.spec.js'
    },
    jshint: {
      src: ['<%= meta.src %>', '<%= meta.specs %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
      },
      once: {}
    },
    watch: {
      test: {
        files: ['<%= meta.src %>', '<%= meta.specs %>'],
        tasks: ['test'],
        options: {
          atBegin: true
        }
      }
    },
    coveralls: {
      travis: {
        src: 'coverage/*/lcov.info'
      }
    },
    clean: {
      build: ['dist', 'coverage', 'test-results.xml', 'doc']
    },
    concat: {
      options: {
        separator: '\n\n',
        banner: '/*! <%= pkg.title %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'lib/*.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    replace: {
      dist: {
        options: {
          variables: {
            'version': '<%= pkg.version %>'
          }
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['dist/*.js'],
            dest: 'dist/'
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.title %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src:  'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    release: {
      options: {
        bump:     true,  // bump the version in your package.json file.
        add:      false, // stage the package.json file's change.
        commit:   false, // commit that change with a message like "release 0.6.22".
        tag:      false, // create a new git tag for the release.
        push:     false, // push the changes out to github.
        pushTags: false, // also push the new tag out to github.
        npm:      false  // publish the new version to npm.
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('doc', 'Generate documentation', function () {
    grunt.log.writeln('Generating Documentation...');
    var
      done = this.async(),
      groc = require('child_process').spawn('./node_modules/.bin/groc', ['lib/*.js', 'README.md']);
    groc.stderr.on('data', function (data) { grunt.log.error(data.toString()); });
    groc.on('exit', function (status) {
      if (0 === status) {
        grunt.log.writeln('...done!');
        done();
      } else {
        done(false);
      }
    });
  });

  grunt.registerTask('default', ['watch:test']);
  grunt.registerTask('build', ['test', 'clean:build', 'doc', 'concat', 'replace', 'uglify']);
  grunt.registerTask('test', ['jshint', 'karma:once']);
  grunt.registerTask('test_travis', ['test', 'coveralls:travis']);
};
