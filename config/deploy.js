/* jshint node: true */
'use strict';

module.exports = function(deployTarget) {
  var Promise = require('ember-cli/lib/ext/promise');
  var appName = 'bateman-ember';
  var prefix = 'bateman-ember';

  var VALID_DEPLOY_TARGETS = [
    'dev',
    'prod'
  ];
  var ENV = {};
  ENV.build = {};
  ENV.gzip = {
    zopfli: false
  };
  ENV.redis = {
    allowOverwrite: true,
    keyPrefix: prefix + ':index',
    filePattern: 'index.json'
  };
  ENV.s3 = {
    // prefix: prefix,
    // region: 'us-east-1'
  };
  ENV.slack = {
    webhookURL: process.env.ELEGANT_AND_TASTEFUL_EMBER_CLI_DEPLOY_SLACK_WEBHOOK,
    didDeploy: function() {},
    didFail: function() {}
  };

  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget === 'dev') {
    ENV.build.environment = 'development';
    ENV.redis.revisionKey = 'dev';
    ENV.redis.url = process.env.BATEMAN_REDIS_URL;
    ENV.plugins = ['build', 'json-config', 'redis'];
  }

  var domain;
  var herokuAppName;

  if (deployTarget === 'prod') {
    ENV.build.environment = 'production';

    ENV.s3.accessKeyId = process.env.BATEMAN_AWS_ACCESS_KEY_ID;
    ENV.s3.secretAccessKey = process.env.BATEMAN_AWS_SECRET_ACCESS_KEY;
    ENV.s3.bucket = 'bateman.work-assets';

    ENV.slack.didDeploy = function(context) {
      return function(slack){
        var message;
        var revisionKey = context.revisionData.revisionKey;
        if (revisionKey && !context.revisionData.activatedRevisionKey) {
          message = "Deployed " + appName + " to " + process.env.DEPLOY_TARGET + " but did not activate it.\n"
               + "Preview: http://" + domain + "?manifest_id=" + revisionKey + "\n"
               + "Activate: `ember deploy:activate " + process.env.DEPLOY_TARGET + ' --revision='+ revisionKey + "`\n";
        } else {
          message = 'Deployed and activated ' + appName + ' to ' + process.env.DEPLOY_TARGET + ' (revision ' + revisionKey + ')';
        }
        return slack.notify(message);
      };
    };
    ENV.slack.didActivate = function(context) {
      if (context.commandOptions.revision) {
        return function(slack){
          var message = "Activated " + appName + " revision on " + process.env.DEPLOY_TARGET + ": " + context.revisionData.activatedRevisionKey + "\n";
          return slack.notify(message);
        };
      }
    };

    ENV.redis.url = process.env.REDIS_URL; // optional, falls back to reading from heroku below
    domain = 'www.bateman.work';
    herokuAppName = 'bateman-rails';
    ENV.redis.didDeployMessage = function(context) {
      if (context.revisionData.revisionKey && !context.revisionData.activatedRevisionKey) {
        var revisionKey = context.revisionData.revisionKey;
        return 'Deployed but did not activate revision ' + revisionKey + '.\n' +
             'To preview:\n' +
             'http://' + domain + '?manifest_id=' + revisionKey + '\n' +
             'To activate:\n' +
             'ember deploy:activate ' + process.env.DEPLOY_TARGET + ' --revision=' + revisionKey + '\n';
      }
    };
  }

  return Promise.resolve().then(function(){
    if (deployTarget === 'prod') {
      if (!ENV.redis.url || ENV.redis.url === '') {
        return new Promise(function(resolve, reject){
          var exec = require('child_process').exec;
          exec('heroku config:get REDIS_URL --app ' + herokuAppName, function (error, stdout, stderr) {
            ENV.redis.url = stdout.replace(/\n/, '').replace(/\/\/h:/, '//:');
            resolve(ENV);
          });
        });
      }
    }
    return ENV;
  });
};
