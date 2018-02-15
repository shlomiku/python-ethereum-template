FROM python:3.6

ENV PYTHONUNBUFFERED 1

COPY ./compose/production/django/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r//' /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY ./compose/local/django/start.sh /start.sh
RUN sed -i 's/\r//' /start.sh
RUN chmod +x /start.sh

COPY ./compose/local/django/celery/worker/start.sh /start-celeryworker.sh
RUN sed -i 's/\r//' /start-celeryworker.sh
RUN chmod +x /start-celeryworker.sh

COPY ./compose/local/django/celery/beat/start.sh /start-celerybeat.sh
RUN sed -i 's/\r//' /start-celerybeat.sh
RUN chmod +x /start-celerybeat.sh

WORKDIR /app

ENTRYPOINT ["/entrypoint.sh"]

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY ./requirements /requirements
RUN pip install -r /requirements/local.txt
COPY ./compose/local/django/install_solc.py /install_solc.py
RUN python /install_solc.py
#ENV SOLC_BINARY `find /root -name solc`
ENV SOLC_BINARY /root/.py-solc/solc-v0.4.19/bin/solc
RUN echo $SOLC_BINARY
# from solc import compile_source
# compile_source(open('/app/solidity/test.sol').read())
