from django.db import models


class Status(models.Model):
    """Статус движения денежных средств"""

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Status"
        verbose_name_plural = "Statuses"

    def __str__(self) -> str:
        return self.name


class CashFlowType(models.Model):
    """Тип движения денежных средств"""

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Cash flow type"
        verbose_name_plural = "Cash flow types"

    def __str__(self) -> str:
        return self.name


class Category(models.Model):
    """Категория движения денежных средств"""

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self) -> str:
        return self.name


class Subcategory(models.Model):
    """Подкатегория движения денежных средств"""

    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="subcategories",
    )

    class Meta:
        verbose_name = "Subcategory"
        verbose_name_plural = "Subcategories"

    def __str__(self) -> str:
        return self.name
