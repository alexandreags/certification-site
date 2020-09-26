#!/usr/bin/env bash

sudo apt update -y
sudo apt install nodejs -y
sudo apt install npm -y
git clone https://github.com/alexandreags/certification-site.git
cd certification-site
sudo npm install -g
sudo node server.js

