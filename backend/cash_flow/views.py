from rest_framework import permissions, viewsets
from .models import CashFlowType, Status, Category, Subcategory, CashFlow
from .serializers import CashFlowTypeSerializer, StatusSerializer, CategorySerializer, SubcategorySerializer, CashFlowSerializer

class CashFlowTypeViewSet(viewsets.ModelViewSet):
    queryset = CashFlowType.objects.all()
    serializer_class = CashFlowTypeSerializer
    permission_classes = [permissions.AllowAny]


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [permissions.AllowAny]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer
    permission_classes = [permissions.AllowAny]


class CashFlowViewSet(viewsets.ModelViewSet):
    queryset = CashFlow.objects.all()
    serializer_class = CashFlowSerializer
    permission_classes = [permissions.AllowAny]

    