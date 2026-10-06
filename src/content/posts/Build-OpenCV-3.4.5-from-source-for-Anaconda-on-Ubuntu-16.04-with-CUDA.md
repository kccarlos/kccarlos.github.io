---
title: Build OpenCV 3.4.5 from source for Anaconda on Ubuntu 16.04 with Cuda
date: 2019-03-18 20:13:40
archived: true
categories: Computer-Vision
tags:
- OpenCV
- Ubuntu
---
![OpenCV Logo](/uploads/OpenCV_Logo.png)
<!--more-->
Sometimes you may need some special packages in openCV that are not included in the pre-built version. You may also need this opencv to be linked to the anaconda/miniconda virtual environment that you already created. This one is tricky as the configuration is pretty complex, especially for people like me not used to C++. I have read a lot of online blogs and could not find out one that works perfectly for my situation. Therefore, I logged down my experience, hoping to save you from investing time preparing the environment. 

## Install Cuda and test installation

Please refer to Nvidia's detailed Cuda [installation guide](https://docs.nvidia.com/Cuda/Cuda-installation-guide-linux/index.html). Please notice that this link refers to Cuda 10 and you should choose the version applicable. Sometimes OpenCV is not yet compatible to the latest Cuda. Therefore, I recommend installing a previous version Cuda, like 9.0. In this post, I chose Cuda 9.0 to comply with Tensorflow 1.12 and OpenCV 3.4.5 I am going to install later.

## Install dependencies

__Reference:__ https://www.pytorials.com/how-to-install-opencv340-on-ubuntu1604/

```sh
sudo apt-get update
sudo apt-get install build-essential
sudo apt-get install cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
sudo apt-get install libxvidcore-dev libx264-dev
sudo apt-get install libgtk-3-dev
sudo apt-get install libatlas-base-dev gfortran pylint
sudo apt-get install python2.7-dev python3.5-dev
```
__Notice__:

 - You need to install python3-numpy in order to let OpenCV build for Python 3, which is missed in the article I referenced.

```sh
sudo apt-get install python3-numpy

```
 - Besides, you may install ccmake for a friendly UI in later compilation

```sh
sudo apt-get install cmake-curses-gui
```
 - if GCC, G++ is missed in your computer, you may install them as well

```sh
sudo apt-get install gcc g++
```

## Download OpenCV 3.4.5

```sh
wget https://github.com/opencv/opencv/archive/3.4.5.zip -O opencv-3.4.5.zip
wget https://github.com/opencv/opencv_contrib/archive/3.4.5.zip -O opencv_contrib-3.4.5.zip
unzip opencv-3.4.5.zip
unzip opencv_contrib-3.4.5.zip
```

## Configure OpenCV installation

__Notice: __

 - OPENCV_EXTRA_MODULES_PATH should be changed to adapt to your computer.

```sh
cd opencv-3.4.5
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local -DOPENCV_EXTRA_MODULES_PATH=/home/cvpl/cvproj/opencv_contrib-3.4.5/modules -DPYTHON_DEFAULT_EXECUTABLE=/usr/bin/python3.5 ..
```
 - You may execute ccmake .. for a GUI configuration experience
```sh
ccmake ..
```

## Compile and install

First, check how many cores you have in your computer. If there are 8, run -j8.
```sh
cat /proc/cpuinfo | grep processor | wc -l
make -j8
```

If you face the following issue, probably it is due to the incompatibility of Cuda and OpenCV. Cuda 10 was released after OpenCV 3.4.5, so try to install Cuda 9.0 to your computer instead.

```
Makefile:160: recipe for target 'all' failed
Issue page: https://github.com/opencv/opencv/issues/7652
```
After long waiting and no errors occur, start installation.

```sh
sudo make install
```

## Install anaconda/miniconda and create a virtual environment

 - Here I used miniconda as an example. Download and install miniconda
```sh
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

 - Then, we need to edit the system variable in order to use conda command. Without doing this, you need to specify bin path each time you open a new command to use conda.
```sh
gedit ~/.bashrc
	# Add at the last line
export PATH=/home/cvpl/miniconda3/bin:$PATH
```
 - Create a virtual environment and install numpy

```sh
conda create --name cvpy3 python=3.5
source acitvate cvpy3
conda install numpy
```

## Link openCV binding to miniconda virtual environment

Right now you are one last step before using "import cv2". Just find a .so file and copy it to your virtual environment library. You may spend some time looking for it. Normally it is under usr/local/lib/pythonXX/site-packages/cv2/python-3.x. Rename it as cv2.co and copy it to the target directory.

```sh
cd /usr/local/lib/python2.7/dist-packages/cv2/python-2.7
sudo cp cv2.so /home/cvpl/miniconda3/envs/cvpy2/lib/python2.7/site-packages/cv2.so
```
You may create a python 2 environment and do so for python 2.

```sh
conda create --name cvpy2 python=2.7
source acitvate cvpy2
cd /usr/local/lib/python2.7/site-packages/cv2/python-2.7
sudo cp cv2.cpython-35m-x86_64-linux-gnu.so cv2.so
sudo mv cv2.so /home/cvpl/miniconda3/envs/cvpy3/lib/python3.5/site-packages/cv2.so
```

## Test the installation

Try starting a python session and import cv2. If no error occurs, then congratulations ;)

```sh
python
import cv2
```

## References:
Here are the posts I checked out to walk through this process.
1. https://www.pytorials.com/how-to-install-opencv340-on-ubuntu1604/
2. https://github.com/opencv/opencv/issues/8425
3. https://stackoverflow.com/questions/37070304/how-to-build-opencv-for-python3-when-both-python2-and-python3-are-installed
4. https://stackoverflow.com/questions/42745993/compiling-opencv-how-to-build-the-cv2-so-module-for-python3-6
5. https://www.tutorialspoint.com/unix_commands/make.htm
6. http://answers.opencv.org/question/173105/successfully-built-opencv-330-but-no-cv2so-found/
