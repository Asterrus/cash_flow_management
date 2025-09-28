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

    cash_flow_type = serializers.PrimaryKeyRelatedField(queryset=CashFlowType.objects.all())
    cash_flow_type_name = serializers.CharField(source="cash_flow_type.name", read_only=True)

    class Meta:
        model = Category
        fields = ["name", "cash_flow_type", "cash_flow_type_name"]


class SubcategorySerializer(serializers.ModelSerializer):
    """Serializer for Subcategory model"""

    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Subcategory
        fields = ["name", "category", "category_name"]


class CashFlowSerializer(serializers.ModelSerializer):
    """Serializer for CashFlow model"""

    subcategory = serializers.PrimaryKeyRelatedField(queryset=Subcategory.objects.all())
    cash_flow_type = serializers.PrimaryKeyRelatedField(queryset=CashFlowType.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())

    cash_flow_type_name = serializers.CharField(source="cash_flow_type.name", read_only=True)
    category_name = serializers.CharField(source="subcategory.category.name", read_only=True)
    subcategory_name = serializers.CharField(source="subcategory.name", read_only=True)
    status_name = serializers.CharField(source="status.name", read_only=True)

    class Meta:
        model = CashFlow
        fields = [
            "status",
            "cash_flow_type",
            "cash_flow_type_name",
            "category_name",
            "subcategory",
            "subcategory_name",
            "amount",
            "created_at",
            "comment",
            "status_name",
        ]
