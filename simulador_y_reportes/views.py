from django.shortcuts import render, redirect
from .models import PayloadUsuario

def pagina_principal(request):
    if request.method == 'POST':
        payload = request.POST.get('payload')
        if payload:
            PayloadUsuario.objects.create(payload = payload)
            return redirect('index')
    return render(request, 'index.html')
