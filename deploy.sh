#!/usr/bin/env sh

set -e

vue-cli-service build

cd dist

git init
git add -A
git commit -m 'build: new deployment'

git push -f git@github.com:sadsprrw/tree-list.git master:gh-pages

cd -