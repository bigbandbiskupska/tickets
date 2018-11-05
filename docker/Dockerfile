FROM node:8
MAINTAINER Kryštof Tulinger <k.tulinger@gmail.com>

ENV WWW_ROOT /app

RUN apt-get -y update && \
  apt-get -y install git zip nano

RUN apt-get -y clean

WORKDIR /usr/bin

WORKDIR $WWW_ROOT

EXPOSE 80

ADD . /docker
RUN chmod -R +x /docker
CMD ["/docker/start.sh"]