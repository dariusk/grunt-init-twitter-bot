/*
 * grunt-init-node
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a Twitter bot!';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ shouldn\'t contain "node" or "js" and should ' +
  'be a unique ID not already in use at search.npmjs.org.';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After that, you may execute project tasks with _grunt_. For ' +
  'more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({type: 'node'}, [
    // Prompt for these values.
    init.prompt('name'),
    {
      name: 'displayName',
      message: 'Enter project name as appears to actual end users',
      default: 'My Bot',
      warning: 'seriously, enter this'
    },
    init.prompt('description'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('node_version', '>= 0.8.0'),
    {
      name: 'wordnik_apikey',
      message: 'Enter your Wordnik API key',
      default: '',
      warning: 'seriously, enter this if you plan to use Wordnik at all'
    },
    {
      name: 'twitter_consumer_key',
      message: 'Enter your Twitter consumer key',
      default: '',
      warning: 'you can\'t tweet without this'
    },
    {
      name: 'twitter_consumer_secret',
      message: 'Enter your Twitter consumer secret',
      default: '',
      warning: 'you can\'t tweet without this'
    },
    {
      name: 'twitter_access_token',
      message: 'Enter your Twitter access token',
      default: '',
      warning: 'you can\'t tweet without this'
    },
    {
      name: 'twitter_access_token_secret',
      message: 'Enter your Twitter access token secret',
      default: '',
      warning: 'you can\'t tweet without this'
    },
  ], function(err, props) {
    props.keywords = [];
    props.dependencies = {
      'request': '~2.27.0',
      'underscore': '~1.5.1',
      'inflection': '~1.2.6',
      'cheerio': '~0.12.2',
      'twit': '~1.1.9',
      'underscore.deferred': '~0.4.0'
    }
    props.devDependencies = {
      'grunt-contrib-jshint': '~0.6.0',
      'grunt-contrib-watch': '~0.4.0',
    };

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};
