from django.contrib import admin

# Register your models here.
from .models import CashFlowType, Status


class StatusAdmin(admin.ModelAdmin):
    """Admin for Status model"""

    fieldsets = [
        (None, {"fields": ["name"]}),
    ]


class CashFlowTypeAdmin(admin.ModelAdmin):
    """Admin for CashFlowType model"""

    fieldsets = [
        (None, {"fields": ["name"]}),
    ]


admin.site.register(Status, StatusAdmin)
admin.site.register(CashFlowType, CashFlowTypeAdmin)
