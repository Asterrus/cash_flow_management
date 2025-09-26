#!/bin/sh
set -e

# Create database
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Load initial data
# python manage.py loaddata initial_data # Сейчас загружается через миграцию

# Create superuser
DJANGO_ADMIN_USER=${DJANGO_ADMIN_USER}
DJANGO_ADMIN_EMAIL=${DJANGO_ADMIN_EMAIL}
DJANGO_ADMIN_PASSWORD=${DJANGO_ADMIN_PASSWORD}

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='$DJANGO_ADMIN_USER').exists():
    User.objects.create_superuser('$DJANGO_ADMIN_USER', '$DJANGO_ADMIN_EMAIL', '$DJANGO_ADMIN_PASSWORD')
"

# Run application
exec "$@"
