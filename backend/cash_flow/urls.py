from django.urls import include, path
from rest_framework import routers

from .views import CashFlowTypeViewSet, StatusViewSet, CategoryViewSet, SubcategoryViewSet, CashFlowViewSet

router = routers.DefaultRouter()
router.register(r"cash_flow_types", CashFlowTypeViewSet)
router.register(r"statuses", StatusViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"subcategories", SubcategoryViewSet)
router.register(r"cash_flows", CashFlowViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
