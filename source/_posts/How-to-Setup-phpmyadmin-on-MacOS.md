---
title: How to Setup phpmyadmin on MacOS
date: 2018-11-11 10:23:15
header-img:
tags:
- MySQL
- MacOS
categories:
- Database
---
![phpmyadmin_logo](/uploads/Phpmyadmin_logo.png)
<!--more-->
Since I am using Mac and I am desperately in need to test PHP, I researched on how to use phpmyadmin on MacOS. It seems Mac has apache built-in so there is no need to install another one. Here I summarize the steps I took to make it work:

## Start the built in apache
Run the following command
```shell
sudo apachectl start
```
Browse to localhost, then if "It works" is printed, the apache is started properly.

## Enable php
Modify httpd.conf
```shell
sudo vi /etc/apache2/httpd.conf
```
Find and uncomment this line (Remove #)
```shell
LoadModule php7_module libexec/apache2/libphp7.so
```
Restart apache
```shell
sudo apachectl restart
```

## Configure the home directory
The message "It works" comes from the /Library/WebServer/Documents/info.php
Now we want to change the directory to User/Sites.
Create a folder named "Sites" under your User folder. Then, run command
```shell
sudo vi /etc/apache2/httpd.conf
```
Change both occurances of "/Library/WebServer/Documents/" from
```
DocumentRoot "/Library/WebServer/Documents/"
<Directory "/Library/WebServer/Documents/">
```
to
```
DocumentRoot "/Users/Carlos/Sites"
<Directory "/Users/Carlos/Sites">
```
Again, don't forget to restart apache

```shell
sudo apachectl restart
```

## Check apache
Now we add a php file named index.php to the Sites folder we created.

```php
<?php
echo "Success!";
phpinfo();
?>
```

Then, naviagate browser  to localhost and You can see the word "Success!"
![1b.png](https://i.loli.net/2018/11/19/5bf2c0f9e5366.png)

## Setup phpmyadmin

1. Download the software from official website. https://www.phpmyadmin.net/downloads/

2. Unzip the installation file inside the "Sites" folder.

Don't forget to rename the folder name so that it is easier to access via browser. I choose the name "phpmyadmin".
![1a.png](https://i.loli.net/2018/11/19/5bf2bb3966584.png)

3. Create a setup file
Navigate browser to http://localhost/phpmyadmin/setup.

Click on "New server". Type in the hostname, password, username of the mysql server. After applying the settings, click download. Place the downloaded file into phpmyadmin folder. __NOTICE__: If you are using local mysql server, input the host name as 127.0.0.1

## Login to phpmyadmin

Navigate to localhost/phpmyadmin. Now you can login with the username and password.

## References:
1. https://jason.pureconcepts.net/2014/11/configure-apache-virtualhost-mac-os-x/
2. https://www.youtube.com/watch?v=YzlFqNXJgfM
