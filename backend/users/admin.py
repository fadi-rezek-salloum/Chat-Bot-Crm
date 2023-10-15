from django.contrib import admin
from .models import User,Role,Account,AccountStatus
# Register your models here.
admin.site.register(User)
admin.site.register(Role)
admin.site.register(Account)
admin.site.register(AccountStatus)