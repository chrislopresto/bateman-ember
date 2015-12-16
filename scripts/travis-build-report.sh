#!/usr/bin/env bash
set -e

echo "TRAVIS BUILD OVERVIEW"
echo "---------------------"
echo "Branch:          $TRAVIS_BRANCH"
echo "Build Id:        $TRAVIS_BUILD_ID"
echo "Build Dir:       $TRAVIS_BUILD_DIR"
echo "Build Number:    $TRAVIS_BUILD_NUMBER"
echo "Commit:          $TRAVIS_COMMIT"
echo "Commit Range:    $TRAVIS_COMMIT_RANGE"
echo "Job Id:          $TRAVIS_JOB_ID"
echo "Job Number:      $TRAVIS_JOB_NUMBER"
echo "Pull Request:    $TRAVIS_PULL_REQUEST"
echo "Secure Env Vars: $TRAVIS_SECURE_ENV_VARS"
echo "Repo Slug:       $TRAVIS_REPO_SLUG"
echo "OS Name:         $TRAVIS_OS_NAME"
echo "Tag:             $TRAVIS_TAG"
