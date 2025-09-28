from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from cash_flow import urls as cash_flow_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(cash_flow_urls)),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
