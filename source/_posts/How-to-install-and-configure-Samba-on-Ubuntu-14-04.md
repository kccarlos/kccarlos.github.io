---
title: How to install and configure Samba on Ubuntu 14.04
date: 2019-06-03 17:45:52
categories: Linux
tags:
- Samba
- Ubuntu
---
![Samba Logo](/uploads/samba_logo.png)
<!--more-->
I am using AWS EC2 for model training, which is running Ubuntu 14.04. Samba can make file access and transfer between Windows and Linux so much easier. 

## 1. Install Samba

```sh
sudo apt-get update
sudo apt-get install samba samba-common
sudo apt-get install python-glade2 system-config-samba
sudo apt-get install libtall # Don't forget to install this
```

## 2a. Configurations for a publicly shared folder

### Operations on Ubuntu
Say we want to share the *public* folder under *mnt*

```sh
sudo mkdir -p /mnt/public
sudo chown nobody:nogroup /mnt/public
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
sudo vim /etc/samba/smb.conf
```
Add the following lines to the bottom of the configuration file

```
[public]
   comment = Public share
   path = /mnt/public
   browsable = yes
   writable = yes
   guest ok = yes
   read only = no
   force user = nobody
   force group = nogroup
```
Finally do some checkings and restart Samba service

```sh
testparm # test if the configuration is written correctly
sudo service smbd restart
```
### Operations on Windows


## 2b. Configurations for a securely shared folder
```sh
sudo mkdir -p /mnt/secured
sudo addgroup smbproj1
sudo chown root:smbproj1  /mnt/secured
sudo chmod 770 /mnt/secured
sudo vim /etc/samba/smb.conf
```
Add the following lines:

```
[secured]
   comment = Secure share access
   path = /mnt/secured
   valid users = @smbproj1
   browsable = yes
   writable = yes
   guest ok = no
```
Add a new user to the group and restart Samba

```sh
sudo useradd carlos -s /usr/sbin/nologin -G smbproj1
sudo smbpasswd -a carlos
   # if the user already exists,
   # use this command to add it to the group  
   # sudo usermod ubuntu -G smbproj1
testparm
sudo service smbd restart
```
Then login again to let the changes take effect.

## 3. References
 - https://blog.csdn.net/lan120576664/article/details/50396511
 - https://wiki.ubuntu.com/Ubuntu_14.04_LTS
 - https://www.cnblogs.com/liuquan/p/5644760.html
 - https://www.krizna.com/ubuntu/setup-file-server-ubuntu-14-04-samba/#anonymous
 - https://blog.51cto.com/yangzhiming/1969556
