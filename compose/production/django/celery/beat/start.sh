#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset


celery -A ether_ready_py.taskapp beat -l INFO
