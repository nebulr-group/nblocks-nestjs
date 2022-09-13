#!/bin/bash
## Usage
## ./init_local.sh WORKSPACE_FOLDER_PATH
PWD=$(dirname $0)
source $PWD/secrets.env.default


echo "Installing vim"
apt-get update
apt-get -y install vim
# microsoft docker container contains no vim but vim.tiny
echo "Configuring GIT"
git config --global core.editor "vim"
git config --global user.email $GIT_EMAIL
git config --global user.name $GIT_NAME

echo "Linking AWS credentials"
ln -s $1/nebulr/infra/aws/ ~/.aws

echo "Done dev specific initializing, running workspace_folder/init.sh..."
. $1/init.sh