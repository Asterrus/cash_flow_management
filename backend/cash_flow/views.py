from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import pagination, permissions, viewsets

from .filters import CashFlowFilter
from .models import CashFlow, CashFlowType, Category, Status, Subcategory
from .serializers import (
    CashFlowSerializer,
    CashFlowTypeSerializer,
    CategorySerializer,
    StatusSerializer,
    SubcategorySerializer,
)


class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 1
    page_size_query_param = "page_size"
    max_page_size = 100


class CashFlowTypeViewSet(viewsets.ModelViewSet):
    queryset = CashFlowType.objects.all()
    serializer_class = CashFlowTypeSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().select_related("cash_flow_type")
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all().select_related("category")
    serializer_class = SubcategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class CashFlowViewSet(viewsets.ModelViewSet):
    queryset = CashFlow.objects.all().select_related(
        "cash_flow_type", "status", "subcategory", "subcategory__category"
    )
    serializer_class = CashFlowSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CashFlowFilter
    pagination_class = StandardResultsSetPagination
