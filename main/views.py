import uuid

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


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
def qr_search(request):
    return render(request, 'chat_join/qr.html')


@login_required
def chat_join_qr(request, chat_id):
    try:
        request.session['uuid'] = str(uuid.UUID(chat_id))
        return redirect('chat')
    except ValueError:
        return redirect('home')


@login_required
def chat_make(request):
    return render(request, 'chat_make/index.html', {'uuid': uuid.uuid4()})


@login_required
def chat(request):
    if request.method == 'POST':
        request.session['uuid'] = request.POST['uuid']
        return render(request, 'chat/index.html', {'uuid': request.POST['uuid']})
    if 'uuid' in request.session:
        return render(request, 'chat/index.html', {'uuid': request.session['uuid']})
    return redirect('home')


@login_required
def chat_qr(request):
    if request.method == 'POST':
        return render(request, 'chat/qr.html', {'uuid': request.POST['uuid']})


@login_required
def paint(request):
    if request.method == 'POST':
        return render(request, 'chat/paint.html', {'uuid': request.POST['uuid']})


@login_required
def chat_log(request):
    return render(request, 'chat_log/index.html')
