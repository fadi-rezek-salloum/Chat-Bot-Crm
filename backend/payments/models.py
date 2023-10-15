from django.db import models
from users.models import Account

# Create your models here.



class Feature(models.Model):
    name=models.CharField(max_length=1000,null=False)
    def __str__(self):
        return self.name

class Plan(models.Model):
    name=models.CharField(max_length=100)
    features=models.ManyToManyField(Feature)
    monthly_price=models.FloatField()
    quarterly_price=models.FloatField()
    yearly_price=models.FloatField()
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class Payment(models.Model):
    transaction_id=models.CharField(max_length=100)
    amount=models.FloatField()
    payment_method=models.CharField(max_length=100)
    currency=models.CharField(max_length=100)
    status=models.CharField(max_length=100)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.transaction_id +" "+str(self.amount)

class Subscription(models.Model):
    plan=models.ForeignKey(Plan,on_delete=models.CASCADE)
    payment=models.OneToOneField(Payment,on_delete=models.CASCADE)
    account=models.ForeignKey(Account,on_delete=models.CASCADE)
    start_date=models.DateTimeField(auto_now_add=True)
    end_date=models.DateTimeField()
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.plan.name +" "+self.account.user.username