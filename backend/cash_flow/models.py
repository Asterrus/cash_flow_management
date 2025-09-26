from django.db import models

class Status(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Status"
        verbose_name_plural = "Status"