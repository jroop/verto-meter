#!/bin/bash

# this script needs to be ran as: "source [script]" to ensure environment is preserved
# this script will install and setup nvm, node, yarn, pm2

# version of node to install
NODE_VERSION=16.13.1

# only run if node version is not current
if [[ "$(node --version)" == "v${NODE_VERSION}" ]]; then
  echo "node v${NODE_VERSION} already installed, exiting ${0}"
  # cannnot use exit 0 because we call script with source and will exit entire shell
else
  # remove old stuff
  rm $HOME/.npmrc
  rm $HOME/.yarnrc

  # install script
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

  # setup the variables
  source $HOME/.nvm/nvm.sh

  # install version of node and setup under nvm
  nvm install v$NODE_VERSION
  nvm use $NODE_VERSION
  nvm alias default $NODE_VERSION

  # install yarn, package manager to replace npm, globally to nvm
  npm install -g yarn

  # install pm2, node application manager
  # https://pm2.keymetrics.io/docs/usage/quick-start/
  npm install --global pm2@latest

  yarn cache clean
fi

# make node serve on 80
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
