from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import pagination, permissions, viewsets
from rest_framework.filters import OrderingFilter

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
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class CashFlowTypeViewSet(viewsets.ModelViewSet):
    queryset = CashFlowType.objects.all().order_by("name")
    serializer_class = CashFlowTypeSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all().order_by("name")
    serializer_class = StatusSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().select_related("cash_flow_type").order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all().select_related("category").order_by("name")
    serializer_class = SubcategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination


class CashFlowViewSet(viewsets.ModelViewSet):
    queryset = CashFlow.objects.all().select_related(
        "cash_flow_type", "status", "subcategory", "category"
    )
    serializer_class = CashFlowSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CashFlowFilter
    pagination_class = StandardResultsSetPagination
    ordering_fields = [
        "created_at",
        "amount",
        "cash_flow_type__name",
        "category__name",
        "subcategory__name",
        "status__name",
    ]
    ordering = ["-created_at"]
