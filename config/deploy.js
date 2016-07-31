/* jshint node: true */

module.exports = function(deployTarget) {
  var Promise = require('ember-cli/lib/ext/promise');
  var herokuAppName = 'bateman-rails';
  var redisKeyPrefix = 'bateman-ember';

  var ENV = {
    build: {}
    // include other plugin configuration that applies to all deploy targets here
  };

  ENV.s3 = {}
  ENV.slack = {
    webhookURL: process.env.ELEGANT_AND_TASTEFUL_EMBER_CLI_DEPLOY_SLACK_WEBHOOK
  };

  ENV.redis = {
    allowOverwrite: true,
    keyPrefix: redisKeyPrefix + ':index',
    filePattern: 'index.json'
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';

    // Standardize revision key for all development deploys
    ENV.redis.revisionKey = 'development';
    ENV.redis.url = process.env.BATEMAN_REDIS_URL;
    ENV.plugins = ['build', 'json-config', 'redis'];
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV.s3.region = process.env.BATEMAN_AWS_REGION;
    ENV.s3.accessKeyId = process.env.BATEMAN_AWS_ACCESS_KEY_ID;
    ENV.s3.secretAccessKey = process.env.BATEMAN_AWS_SECRET_ACCESS_KEY;
    ENV.s3.bucket = 'bateman.work-assets';
  }

  // Return promise that resolves with the ENV object in order to
  // asynchronously retrieve redis url from heroku for production deploys
  return Promise.resolve().then(function() {
    if (deployTarget === 'production') {
      return new Promise(function(resolve/*, reject*/) {
        var exec = require('child_process').exec;
        exec('heroku config:get REDIS_URL --app ' + herokuAppName, function (error, stdout/*, stderr*/) {
          ENV.redis.url = stdout.replace(/\n/, '').replace(/\/\/h:/, '//:');
          resolve(ENV);
        });
      });
    }

    return ENV;
  });
};
