from django_filters.rest_framework import DateFromToRangeFilter, FilterSet, NumberFilter

from .models import CashFlow


class CashFlowFilter(FilterSet):
    category = NumberFilter(field_name="subcategory__category")
    created_at = DateFromToRangeFilter()

    class Meta:
        model = CashFlow
        fields = ["status", "cash_flow_type", "subcategory", "category", "created_at"]
