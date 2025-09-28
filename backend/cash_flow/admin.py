import logging

from django.contrib import admin

from .models import CashFlow, CashFlowType, Category, Status, Subcategory

logger = logging.getLogger(__name__)


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


class SubcategoryInline(admin.TabularInline):
    """Inline для отображения подкатегорий в категории"""

    model = Subcategory
    extra = 1


class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model"""

    fieldsets = [
        (None, {"fields": ["name"]}),
    ]
    inlines = [SubcategoryInline]


class SubcategoryAdmin(admin.ModelAdmin):
    """Admin for Subcategory model"""

    fieldsets = [
        (None, {"fields": ["name", "category"]}),
    ]


class CashFlowAdmin(admin.ModelAdmin):
    """Admin for CashFlow model"""

    fieldsets = [
        (None, {"fields": ["amount", "cash_flow_type", "subcategory", "status", "comment"]}),
    ]


admin.site.register(Status, StatusAdmin)
admin.site.register(CashFlowType, CashFlowTypeAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Subcategory, SubcategoryAdmin)
admin.site.register(CashFlow, CashFlowAdmin)
