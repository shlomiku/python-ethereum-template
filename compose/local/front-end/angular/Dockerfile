FROM node:8.9

WORKDIR /opt/project

RUN apt-get update
RUN apt-get install -y git python make g++

#RUN npm install -g @angular/cli

# install node packages
RUN cd /opt/project
COPY ./lottery-fe-angular/package.json package.json


# --no-bin-links: https://github.com/npm/npm/issues/2380

RUN npm install --no-bin-links;exit 0
### exit 0 and re-run is a hack to avoid this error: Maximum call stack size exceeded
RUN npm install --no-bin-links;exit 0
#
#
#
RUN set -ex; \
	apt-get update; \
	apt-get install -y --no-install-recommends

#CMD ping 8.8.8.8
CMD npm start
