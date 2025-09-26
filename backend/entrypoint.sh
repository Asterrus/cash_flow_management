#!/bin/sh
set -e

python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
# uv run python manage.py loaddata initial_data.json || true  # если фикстуры есть

exec "$@"
