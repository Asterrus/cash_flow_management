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
