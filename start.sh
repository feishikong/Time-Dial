#!/bin/sh


killall conky
cd "$(dirname "$0")"/src
pwd

sleep 1
conky -c conky.conf &
