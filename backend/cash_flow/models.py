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
    cash_flow_type = models.ForeignKey(
        CashFlowType,
        on_delete=models.PROTECT,
        related_name="categories",
    )

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
        on_delete=models.PROTECT,
        related_name="subcategories",
    )

    class Meta:
        verbose_name = "Subcategory"
        verbose_name_plural = "Subcategories"

    def __str__(self) -> str:
        return self.name


class CashFlow(models.Model):
    """Движение денежных средств"""

    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
    )
    cash_flow_type = models.ForeignKey(
        CashFlowType,
        on_delete=models.PROTECT,
    )
    subcategory = models.ForeignKey(
        Subcategory,
        on_delete=models.PROTECT,
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Cash flow"
        verbose_name_plural = "Cash flows"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["created_at"]),
        ]

    def __str__(self) -> str:
        return (
            f"{self.amount} | {self.cash_flow_type} | {self.category}"
            f" | {self.subcategory} | {self.status} | {self.created_at}"
        )

    @property
    def category(self) -> Category:
        """Return category of cash flow"""
        return self.subcategory.category
