from collections.abc import Mapping
from typing import Any

from rest_framework import serializers

from .models import CashFlow, CashFlowType, Category, Status, Subcategory


class StatusSerializer(serializers.ModelSerializer):
    """Serializer for Status model"""

    class Meta:
        model = Status
        fields = ["id", "name"]
        read_only_fields = ("id",)


class CashFlowTypeSerializer(serializers.ModelSerializer):
    """Serializer for CashFlowType model"""

    class Meta:
        model = CashFlowType
        fields = ["id", "name"]
        read_only_fields = ("id",)


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""

    cash_flow_type = serializers.PrimaryKeyRelatedField(queryset=CashFlowType.objects.all())
    cash_flow_type_name = serializers.CharField(source="cash_flow_type.name", read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "cash_flow_type", "cash_flow_type_name"]
        read_only_fields = ("id",)


class SubcategorySerializer(serializers.ModelSerializer):
    """Serializer for Subcategory model"""

    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Subcategory
        fields = ["id", "name", "category", "category_name"]
        read_only_fields = ("id",)


class CashFlowSerializer(serializers.ModelSerializer):
    """Serializer for CashFlow model"""

    subcategory = serializers.PrimaryKeyRelatedField(queryset=Subcategory.objects.all())
    cash_flow_type = serializers.PrimaryKeyRelatedField(queryset=CashFlowType.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())

    cash_flow_type_name = serializers.CharField(source="cash_flow_type.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    subcategory_name = serializers.CharField(source="subcategory.name", read_only=True)
    status_name = serializers.CharField(source="status.name", read_only=True)

    class Meta:
        model = CashFlow
        fields = [
            "id",
            "status",
            "cash_flow_type",
            "cash_flow_type_name",
            "category",
            "category_name",
            "subcategory",
            "subcategory_name",
            "amount",
            "created_at",
            "comment",
            "status_name",
        ]
        read_only_fields = (
            "id",
            "created_at",
            "cash_flow_type_name",
            "category_name",
            "subcategory_name",
            "status_name",
        )

    def validate(self, data: Mapping[str, Any]) -> Mapping[str, Any]:
        """Ensure the subcategory belongs to the selected category and
        the category belongs to the selected cash flow type"""

        cash_flow_type = data.get("cash_flow_type")
        category = data.get("category")
        subcategory = data.get("subcategory")

        if subcategory and category and subcategory.category_id != category.id:
            error = {"subcategory": "Subcategory does not belong to the selected category."}
            raise serializers.ValidationError(error)

        if cash_flow_type and category and category.cash_flow_type_id != cash_flow_type.id:
            error = {"category": "Category does not belong to the selected cash flow type."}
            raise serializers.ValidationError(error)

        return data

    def validate_amount(self, value: float) -> float:
        """Ensure the amount is positive"""
        if value <= 0:
            error = {"amount": "Amount must be positive"}
            raise serializers.ValidationError(error)
        return value
