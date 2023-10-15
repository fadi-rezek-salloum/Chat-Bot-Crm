from base64 import urlsafe_b64encode
from django.db import IntegrityError
from departments.models import Department
from users.models import Role,User,Account
from rest_framework import serializers
from project.settings import env
from django.db import transaction
from users.models import AccountStatus
from datetime import datetime,timedelta


class roleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Role
        fields='__all__'






class ownerSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(required=True)
    password=serializers.CharField(required=True,write_only=True)
    username=serializers.CharField(required=True)
    class Meta:
        model=User
        fields=['id','username','password','email']
        extra_kwargs={'password':{'write_only':True}}
    def create(self, validated_data):
        try:
            with transaction.atomic():
                # Try creating the user
                role, created = Role.objects.get_or_create(role="owner")
                user = User.objects.create(email=validated_data['email'], username=validated_data['username'], role=role)
                user.set_password(validated_data['password'])
                user.save()
                
                # Create an account for the user
                account = Account.objects.create(user=user)
                account.save()
                AccountStatus.objects.create(account=account,is_trial_active=True,trial_end_date=datetime.now()+timedelta(days=int(env("free_trial_days"))))
                
                Department.objects.create(account=account, department_name=env("default_department_name"), description="default department")
                
                # Send verification email in a new thread (you should implement this part)
                
                return user
        except IntegrityError as e:
            if 'unique constraint' in str(e).lower() and 'username' in str(e).lower():
                raise serializers.ValidationError({'message': 'Username already exists'})
            elif 'unique constraint' in str(e).lower() and 'email' in str(e).lower():
                raise serializers.ValidationError({'message': 'Email already exists'})
            else:
                raise serializers.ValidationError({'message': 'An error occurred during user creation'})
        except Exception:
            # Handle any other exceptions that might occur during user creation
            # You can log the error or perform other necessary actions here
            raise serializers.ValidationError({'message': 'An error occurred during user creation'})
    



class ownerDetailsforAdminSerializer(serializers.ModelSerializer):
    plan=serializers.SerializerMethodField(method_name='get_plan')
    agents=serializers.SerializerMethodField(method_name='get_agents')
    is_trial_active=serializers.SerializerMethodField(method_name='get_is_trial_active')
    is_trial_expired=serializers.SerializerMethodField(method_name='get_is_trial_expired')
    is_subscription_expired=serializers.SerializerMethodField(method_name='get_is_subscription_expired')
    role=serializers.CharField(source='role.role',read_only=True)
    notifications_count=serializers.SerializerMethodField(method_name='get_notifications_count')
    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name','phone_number','is_active','plan','agents','is_trial_active','is_trial_expired','is_subscription_expired','role','notifications_count']
        extra_kwargs={'password':{'write_only':True}}

    def get_plan(self,obj):
        try:
            if obj.account.accountstatus.is_trial_active:
                plan="trial"
            else:
                plan=obj.account.subscription_set.last().plan.name
        except:
            plan=None
        return plan

    def get_agents(self,obj):
        try:
            departments=obj.account.department_set.all()
            agents=[]
            for department in departments:
                agents+=list(department.agents.all())
            agents_number=len(agents)
        except:
            agents_number=None
        return agents_number
    
    def get_is_trial_active(self,obj):
        try:
            is_trial_active=obj.account.accountstatus.is_trial_active
        except:
            is_trial_active=None
        return is_trial_active
    
    def get_is_trial_expired(self,obj):
        try:
            is_trial_expired=obj.account.accountstatus.is_trial_expired()
        except:
            is_trial_expired=None
        return is_trial_expired
    
    def get_is_subscription_expired(self,obj):
        try:
            is_subscription_expired=obj.account.accountstatus.is_subscription_expired()
        except:
            is_subscription_expired=None
        return is_subscription_expired
    def get_notifications_count(self,obj):
        try:
            notifications_count=obj.received_notifications.filter(is_read=False).count()
        except:
            notifications_count=None
        return notifications_count


class ownerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['first_name','last_name','phone_number']
        extra_kwargs={'password':{'write_only':True}}
    def update(self, instance, validated_data):
        instance.first_name=validated_data['first_name']
        instance.last_name=validated_data['last_name']
        instance.phone_number=validated_data['phone_number']
        instance.save()
        return instance



class resetPasswordSerializer(serializers.Serializer):
    new_password=serializers.CharField(required=True,write_only=True)

class changePasswordSerializer(serializers.Serializer):
    old_password=serializers.CharField(required=True,write_only=True)
    new_password=serializers.CharField(required=True,write_only=True)