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

  // Helper to create a "yes/no" question.
  function yn(o) {
    o = grunt.util._.defaults({}, o, {
      default: true,
      warning: 'You must answer [y]es or [n]o.',
    });
    var defaultYes = o.default === true || String(o.default).toLowerCase() === 'y' || String(o.default)[0] === 'Y';
    o.default = defaultYes ? 'Y/n' : 'y/N';
    o.sanitize = function(value, data, done) {
      data[o.name] = defaultYes ? /y/i.test(value) : !/n/i.test(value);
      done();
    };
    return o;
  }
 
  // Helper to process an array of "yes/no" questions.
  function yns(o) {
    return o.map(yn);
  }
  
  // Helper to add a dependency if it doesn't already exist
  function addDep(props, packageName, version) {
    if (props.dependencies[packageName]) {
      return;
    }
    props.dependencies[packageName] = version;
    props.requireCode +=  'var ' + packageName + ' = require(\'' + packageName + '\');\n';
  }

  init.process({type: 'node'}, yns(require('./questions.json')).concat([
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
  ]), function(err, props) {
    props.keywords = [];
    props.requireCode = '';
    props.dependencies = {
      'underscore': '~1.5.1',
      'underscore.deferred': '~0.4.0',
      'inflection': '~1.2.6',
      'twit': '~1.1.9',
      'wordfilter': '0.1.3'
    };
    if (props.cheerio) {
      addDep(props, 'request', '~2.27.0');
      addDep(props, 'cheerio', '~0.12.2');
      props.cheerioCode = '  var url = \'someUrl\';\n' +
                          '  request(url, function (error, response, body) {\n' +
                          '    if (!error && response.statusCode == 200) {\n' +
                          '      var result = \'\';\n' +
                          '      var $ = cheerio.load(body);\n' +
                          '      // parse stuff and resolve\n' +
                          '      dfd.resolve(result);\n' +
                          '    }\n' + 
                          '    else {\n' +
                          '      dfd.reject();\n' +
                          '    }\n' +
                          '  });\n';
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
