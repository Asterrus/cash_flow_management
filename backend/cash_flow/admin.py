from django.contrib import admin

# Register your models here.
from .models import Status

class StatusAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["name"]}),
    ]


admin.site.register(Status, StatusAdmin)