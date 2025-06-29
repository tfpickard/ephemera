#!/bin/bash

#          ╭──────────────────────────────────────────────────────────╮
#          │   Kill and resurrect a Macbook's network (Wifi on en0)   │
#          ╰──────────────────────────────────────────────────────────╯
#           If weird things start happening, like you can ping a host
#           but sshing fails with no route, things might help. If it
#           doesn't, rebooting will... or something else is just really
#           wrong.

# Flush DNS/routing caches
sudo dscacheutil -flushcache
sudo route flush

# Reset network interfaces
sudo ifconfig en0 down && sudo ifconfig en0 up

printf "<ctrl>-c to stop me from nuking the networking in... 5"
for i in 4 3 2 1; do
    sleep 1 && printf "\b$i"
done
echo -e "\b\n"

# Nuclear option: restart networking entirely
sudo launchctl stop com.apple.NetworkSharing
sudo launchctl start com.apple.NetworkSharing
