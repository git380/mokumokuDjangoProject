from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('notion/', views.notion, name='notion'),
    path('support_page/', views.support_page, name='support_page'),
    path('chat_join/', views.chat_join, name='chat_join'),
    path('id_search/', views.id_search, name='id_search'),
    path('qr_search', views.qr_search, name='qr_search'),
    path('chat_join_qr/<str:chat_id>/', views.chat_join_qr, name='chat_join_qr'),
    path('chat_make/', views.chat_make, name='chat_make'),
    path('chat/', views.chat, name='chat'),
    path('chat_qr/', views.chat_qr, name='chat_qr'),
    path('paint/', views.paint, name='paint'),
    path('chat_log/', views.chat_log, name='chat_log'),
]
