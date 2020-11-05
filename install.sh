#!/bin/bash

# assumes node and yarn installed see nvm to install node

# install this app as a systemd service
APP=verto-meter
DIR=$(dirname "${0}")
cd "${DIR}"

# install libs 
yarn install

# make the service file
cat > ${HOME}/${APP}.service << EOF
[Unit]
Description=${APP}
Wants=network-online.target
After=network-online.target

[Service]
Environment="PATH=${NVM_BIN}:$PATH"
WorkingDirectory=${PWD}/
ExecStart=${NVM_BIN}/yarn start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=${APP}.service
Environment=NODE_ENV=production
User=${USER}

[Install]
WantedBy=multi-user.target
EOF

# show the service file
cat ${HOME}/${APP}.service

# allow node to run on port 80
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

# copy to location
sudo cp ${HOME}/${APP}.service /etc/systemd/system/

# reload the daemon
sudo systemctl daemon-reload

# enable the system at boot
sudo systemctl enable ${APP}.service
# to disable the service at boot
# sudo systemctl disable ${APP}.service

# start the application
sudo systemctl restart ${APP}.service

