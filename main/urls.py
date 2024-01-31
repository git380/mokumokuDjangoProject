from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('notion/', views.notion, name='notion'),
    path('support_page/', views.support_page, name='support_page'),
    path('chat_join/', views.chat_join, name='chat_join'),
    path('id_search/', views.id_search, name='id_search'),
    path('chat_make/', views.chat_make, name='chat_make'),
    path('chat/', views.chat, name='chat'),
    path('paint/', views.paint, name='paint'),
]
