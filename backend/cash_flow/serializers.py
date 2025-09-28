from rest_framework import serializers

from .models import CashFlow, CashFlowType, Category, Status, Subcategory


class StatusSerializer(serializers.ModelSerializer):
    """Serializer for Status model"""

    class Meta:
        model = Status
        fields = ["name"]


class CashFlowTypeSerializer(serializers.ModelSerializer):
    """Serializer for CashFlowType model"""

    class Meta:
        model = CashFlowType
        fields = ["name"]


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""

    class Meta:
        model = Category
        fields = ["name", "cash_flow_type"]


class SubcategorySerializer(serializers.ModelSerializer):
    """Serializer for Subcategory model"""

    class Meta:
        model = Subcategory
        fields = ["name", "category"]


class CashFlowSerializer(serializers.ModelSerializer):
    """Serializer for CashFlow model"""

    class Meta:
        model = CashFlow
        fields = ["status", "cash_flow_type", "subcategory", "amount", "created_at", "comment"]