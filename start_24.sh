#!/bin/sh


killall conky
cd "$(dirname "$0")"/24-hours-edition

sleep 1
conky -c conky.conf &
