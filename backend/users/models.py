from base64 import urlsafe_b64encode
from datetime import datetime
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.

class Role(models.Model):
    ADMIN="admin"
    OWNER="owner"
    AGENT ="agent"
    CHOICES=(
        (ADMIN,"admin"),
        (OWNER,"owner"),
        (AGENT,"agent")
    )
    role=models.CharField(max_length=100,unique=True,choices=CHOICES)
    def __str__(self):
        return self.role

class CustomUserManager(BaseUserManager):

    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        role, created = Role.objects.get_or_create(role="admin")
        user = self.create_user(username, email, password, **extra_fields)
        user.role = role
        user.email_verified = True
        user.save()
        return user

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True, blank=True, null=True)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    username = models.CharField(max_length=100, unique=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)
    USERNAME_FIELD = 'username'
    objects = CustomUserManager()  # Use the CustomUserManager

    # serialize the user model
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "is_active": self.is_active,
            "is_staff": self.is_staff,
            "is_superuser": self.is_superuser,
            "date_joined": self.date_joined,
            "last_login": self.last_login,
            "user_name": self.username,
            "role": self.role.role if self.role else None  # Handle None case
        }

    def __str__(self):
        return self.username


class Account(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.username
    
class AccountStatus(models.Model):
    account = models.OneToOneField(Account, on_delete=models.CASCADE)
    is_trial_active = models.BooleanField(default=True)
    trial_start_date = models.DateTimeField(auto_now_add=True)
    trial_end_date = models.DateTimeField(null=True, blank=True)
    subscription_start_date = models.DateTimeField(null=True, blank=True)
    subscription_end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.account.user.username
    #check if trial is expired if we are in trial period and trial is not expired return true
    def is_trial_expired(self):
        if self.is_trial_active and self.trial_end_date is not None:
            return self.trial_end_date < timezone.now()
        return False
    #check if subscription is active if we are in subscription period and subscription is not expired return true
    def is_subscription_expired(self):
        if not self.is_trial_active and self.subscription_end_date is not None:
            print("hhhhhh")
            print(self.subscription_end_date)
            print(timezone.now())
            print(self.subscription_end_date < timezone.now())
            return self.subscription_end_date < timezone.now()
        return False










