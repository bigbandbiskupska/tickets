FROM node:8
MAINTAINER Kryštof Tulinger <k.tulinger@gmail.com>

ENV WWW_ROOT /app

RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list

RUN apt-get -y -o Acquire::Check-Valid-Until=false --allow-unauthenticated update && \
  apt-get -y --allow-unauthenticated install git zip nano

RUN apt-get -y clean

WORKDIR /usr/bin

WORKDIR $WWW_ROOT

EXPOSE 80

ADD . /docker
RUN chmod -R +x /docker
CMD ["/docker/start.sh"]
