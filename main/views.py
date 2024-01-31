from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def home(request):
    return render(request, 'home/index.html')


@login_required
def notion(request):
    return render(request, 'notion/index.html')


@login_required
def support_page(request):
    return render(request, 'notion/support_page.html')
