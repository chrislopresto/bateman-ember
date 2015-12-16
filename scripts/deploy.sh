#!/usr/bin/env bash
set -e

echo "EMBER CLI DEPLOY OVERVIEW"
echo "-------------------------"
echo "Trigger Deploy: $EMBER_CLI_DEPLOY_TRIGGER_DEPLOY"
echo "Environment:    $EMBER_CLI_DEPLOY_ENVIRONMENT"
echo "Activate:       $EMBER_CLI_DEPLOY_ACTIVATE"

if [ "$EMBER_CLI_DEPLOY_TRIGGER_DEPLOY" == "true" ] && [ ! -z "$EMBER_CLI_DEPLOY_ENVIRONMENT" ]; then
  echo "Deploying with Ember CLI Deploy..."
  if [ "$EMBER_CLI_DEPLOY_ACTIVATE" == "true" ]; then
    echo "> ember deploy $EMBER_CLI_DEPLOY_ENVIRONMENT --activate"
    ember deploy $EMBER_CLI_DEPLOY_ENVIRONMENT --activate
  else
    echo "> ember deploy $EMBER_CLI_DEPLOY_ENVIRONMENT"
    ember deploy $EMBER_CLI_DEPLOY_ENVIRONMENT
  fi
else
  echo "Skipping Ember CLI Deploy"
fi
