from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import uuid


@login_required
def home(request):
    return render(request, 'home/index.html')


@login_required
def notion(request):
    return render(request, 'notion/index.html')


@login_required
def support_page(request):
    return render(request, 'notion/support_page.html')


@login_required
def chat_join(request):
    return render(request, 'chat_join/index.html')


@login_required
def id_search(request):
    return render(request, 'chat_join/id.html')


@login_required
def chat_make(request):
    return render(request, 'chat_make/index.html', {'uuid': uuid.uuid4()})


@login_required
def chat(request):
    if request.method == 'POST':
        return render(request, 'chat/index.html', {'uuid': request.POST['uuid']})


@login_required
def paint(request):
    if request.method == 'POST':
        return render(request, 'chat/paint.html', {'uuid': request.POST['uuid']})
