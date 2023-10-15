from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.fields import empty
from .models import AgentDepartment, Department
from users.models import Role, User


#serializer for department creation
class departmentSerializer(serializers.ModelSerializer):
    agents_count = serializers.SerializerMethodField(method_name='get_agents_count', read_only=True)
    class Meta:
        model=Department
        exclude=['account']
    def create(self, validated_data):
        self.account=self.context['request'].user.account
        if self.account.department_set.filter(department_name=validated_data['department_name']).exists():
            raise serializers.ValidationError({'message': 'Department already exists'})
        department=Department.objects.create(account=self.account,**validated_data)
        return department
    def update(self, instance, validated_data):
        instance.department_name=validated_data['department_name']
        instance.description=validated_data['description']
        instance.save()
        return instance
    def get_agents_count(self, instance):
        return instance.agents.count()
    
class agentSerializer(serializers.Serializer):
    id=serializers.UUIDField(source="pk",read_only=True)
    password = serializers.CharField(required=True, write_only=True)
    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    last_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    department_id = serializers.IntegerField(required=True, allow_null=False, write_only=True)
    department_name = serializers.SerializerMethodField(method_name='get_department_name', read_only=True)
    is_active = serializers.SerializerMethodField(method_name='get_is_active',read_only=True)
    notifications_count = serializers.SerializerMethodField(method_name='get_notifications_count', read_only=True)
    is_trial_active=serializers.SerializerMethodField(method_name='get_is_trial_active')
    is_trial_expired=serializers.SerializerMethodField(method_name='get_is_trial_expired')
    is_subscription_expired=serializers.SerializerMethodField(method_name='get_is_subscription_expired')
    role=serializers.SerializerMethodField(method_name='get_role')
    def save(self):
        try:
            department_id = self.validated_data['department_id']
            Department.objects.get(pk=department_id)
        except Department.DoesNotExist:
            raise serializers.ValidationError({'message': 'Department does not exist'})
            
        if User.objects.filter(username=self.validated_data['username']).exists():
            raise serializers.ValidationError({'message': 'Username already exists'})
            
        if User.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError({'message': 'Email already exists'})


        department = Department.objects.get(pk=self.validated_data['department_id'])
        role, created = Role.objects.get_or_create(role="agent")
        user = User.objects.create(username=self.validated_data['username'], role=role)
        user.set_password(self.validated_data['password'])
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.phone_number = self.validated_data.get('phone_number', '')
        user.email = self.validated_data.get('email', '')
        user.save()
        agent_department = AgentDepartment.objects.create(department=department, agent=user)
        
        serialized_user = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'email': user.email,
            'department_id': department.pk,
            'department_name': department.department_name,
        }
        return serialized_user
    
    def update(self, instance, validated_data):
        if instance.username != validated_data['username'] and User.objects.filter(username=validated_data['username']).exists():
            raise serializers.ValidationError({'message': 'Username already exists'})
        
        if instance.email != validated_data['email'] and User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({'message': 'Email already exists'})
        
        instance.username = validated_data.get('username', instance.username)
        instance.set_password(validated_data.get('password', instance.password))
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.email = validated_data.get('email', instance.email)
        
        if 'department_id' in validated_data:
            try:
                department_id = validated_data['department_id']
                department = Department.objects.get(pk=department_id)
            except Department.DoesNotExist:
                raise serializers.ValidationError({'message': 'Department does not exist'})
            
            AgentDepartment.objects.filter(agent=instance).delete()
            AgentDepartment.objects.create(department=department, agent=instance)
        
        instance.save()
        return instance
    
    def get_department_name(self, instance):
        if isinstance(instance, User):
            department = instance.department_set.first()
            return department.department_name if department else None
        else:
            department_id = instance["department_id"]
            try:
                department = Department.objects.get(id=department_id)
                return department.department_name
            except Department.DoesNotExist:
                return None
    def get_is_active(self, instance):
        if isinstance(instance, User):
            return instance.is_active
        else:
            return None
    def get_notifications_count(self, instance):
        if isinstance(instance, User):
            return instance.received_notifications.filter(is_read=False).count()
        else:
            return None
    def get_is_trial_active(self, instance):
        if isinstance(instance, User):
            return instance.department_set.first().account.accountstatus.is_trial_active
        else:
            return None
    def get_is_trial_expired(self, instance):
        if isinstance(instance, User):
            return instance.department_set.first().account.accountstatus.is_trial_expired()
        else:
            return None
    def get_is_subscription_expired(self, instance):
        if isinstance(instance, User):
            return instance.department_set.first().account.accountstatus.is_subscription_expired()
        else:
            return None
    def get_role(self, instance):
        if isinstance(instance, User):
            return instance.role.role
        else:
            return None