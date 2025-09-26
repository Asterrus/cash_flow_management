#!/bin/sh
set -e

python manage.py migrate --noinput
# uv run python manage.py loaddata initial_data.json || true  # если фикстуры есть

exec "$@"
