from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('notion/', views.notion, name='notion'),
    path('support_page/', views.support_page, name='support_page'),
]
