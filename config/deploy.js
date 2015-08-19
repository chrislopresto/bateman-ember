var Promise = require('ember-cli/lib/ext/promise');

var VALID_DEPLOY_ENVIRONMENTS = [
  'dev',
  'devindex',
  'prod'
];

module.exports = function(environment) {
  var ENV = {
    build: {},
    gzip: {
      zopfli: false
    },
    redis: {
      allowOverwrite: true,
      keyPrefix: 'bateman-ember:index',
      filePattern: 'index.json'
    },
    s3: {}
  };

  if (VALID_DEPLOY_ENVIRONMENTS.indexOf(environment) === -1) {
    throw new Error('Invalid environment ' + environment);
  }

  if (environment === 'dev') {
    ENV.build.environment = 'development';
    ENV.redis.url = process.env.BATEMAN_REDIS_URL;
    ENV.redis.revisionKey = 'dev';
    ENV.plugins = ['build', 'json-config', 'redis'];
  }

  if (environment === 'devindex') {
    ENV.build.environment = 'devindex';
    ENV.redis.url = process.env.BATEMAN_REDIS_URL;
    ENV.plugins = ['build', 'json-config', 'redis'];
  }

  var domain;
  var herokuAppName;

  if (environment === 'prod') {
    ENV.build.environment = 'production';

    ENV.s3.accessKeyId = process.env.BATEMAN_AWS_ACCESS_KEY_ID;
    ENV.s3.secretAccessKey = process.env.BATEMAN_AWS_SECRET_ACCESS_KEY;
    ENV.s3.bucket = 'bateman.work-assets';

    ENV.redis.url = process.env.REDIS_URL; // optional, falls back to reading from heroku below
    domain = "www.bateman.work";
    herokuAppName = 'bateman-rails';
    ENV.redis.didDeployMessage = function(context) {
      if (context.revisionKey && !context.activatedRevisionKey) {
        return "Deployed but did not activate revision " + context.revisionKey + ".\n"
             + "To preview:\n"
             + "http://" + domain + "?manifest_id=" + context.revisionKey + "\n"
             + "To activate:\n"
             + "ember deploy:activate " + process.env.DEPLOY_TARGET + " --revision=" + context.revisionKey + "\n";
      }
    }
  }

  return Promise.resolve().then(function(){
    if (environment === 'prod') {
      if (!ENV.redis.url) {
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
}
