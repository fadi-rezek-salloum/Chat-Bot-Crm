from django.db import models
from users.models import Account,User

# Create your models here.
class Department(models.Model):
    department_name=models.CharField(max_length=100)
    description=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)
    account=models.ForeignKey(Account,on_delete=models.CASCADE)
    agents=models.ManyToManyField(User,through='AgentDepartment')
    def __str__(self):
        return self.department_name
    
class AgentDepartment(models.Model):
    agent=models.ForeignKey(User,on_delete=models.CASCADE,related_name='agent')
    department=models.ForeignKey(Department,on_delete=models.CASCADE,related_name='department')
    added_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.agent.first_name + " " + self.agent.last_name + " " + self.department.department_name