from django.contrib import admin
from .models import Feature,Plan,Subscription,Payment
# Register your models here.
admin.site.register(Feature)
admin.site.register(Plan)
admin.site.register(Subscription)
admin.site.register(Payment)

