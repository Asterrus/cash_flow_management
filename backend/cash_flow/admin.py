from django.contrib import admin

# Register your models here.
from .models import Status, CashFlowType

class StatusAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["name"]}),
    ]


class CashFlowTypeAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["name"]}),
    ]


admin.site.register(Status, StatusAdmin)
admin.site.register(CashFlowType, CashFlowTypeAdmin)