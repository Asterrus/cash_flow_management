from django_filters.rest_framework import DateFromToRangeFilter, FilterSet

from .models import CashFlow


class CashFlowFilter(FilterSet):
    created_at = DateFromToRangeFilter()

    class Meta:
        model = CashFlow
        fields = ["status", "cash_flow_type", "subcategory", "category", "created_at"]
