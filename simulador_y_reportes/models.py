from django.db import models

class PayloadUsuario(models.Model):
    payload = models.TextField()
    
    def __str__(self):
        return self.payload