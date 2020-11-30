#!/bin/bash

set -eo pipefail

# We want ./dist in the mirror, so remove it from .gitignore.
sed -i '/^dist$/d' .gitignore

# Build JS.
yarn
yarn build
