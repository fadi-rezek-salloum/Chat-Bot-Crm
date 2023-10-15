from base64 import urlsafe_b64decode, urlsafe_b64encode
from django.urls import reverse
from rest_framework import viewsets
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser

from users.permissions import HasActiveSubscriptionOrTrial
from .models import Role, User
from .serializers import changePasswordSerializer, ownerDetailsforAdminSerializer, resetPasswordSerializer, roleSerializer,ownerSerializer,ownerDetailSerializer

from django.utils.encoding import force_str
from django.contrib.auth import get_user_model
import threading
from django.core.mail import send_mail
from django.urls import reverse
from project import settings
from django.utils.encoding import force_bytes,force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.response import Response
from rest_framework import status
from project.settings import env
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes


from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from users.models import User
from socialMediaIntegration.models import Message
from payments.models import Payment
from django.db.models import Sum
from departments.models import AgentDepartment
from django.utils import timezone

from socialMediaIntegration.models import Conversation,Message
from datetime import timedelta
from departments.serializers import agentSerializer

# Create your views here.
class roleView(viewsets.ModelViewSet):
    queryset=Role.objects.all()
    serializer_class=roleSerializer
    permission_classes=[AllowAny]

class ownerView(GenericAPIView):
    permission_classes=[AllowAny]
    serializer_class=ownerSerializer
    def post(self,request):
        serializer=ownerSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            #user send email to verify account
            t1 = threading.Thread(target=send_verification_email, args=(user.id,))
            t1.start()
            return Response({"user":serializer.data},status=status.HTTP_201_CREATED)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

class getAllOwnersView(GenericAPIView):
    permission_classes=[IsAdminUser]
    def get(self,request):
        #get all owners
        #change the serializer
        owners=User.objects.filter(role__role="owner")
        serializer=ownerDetailsforAdminSerializer(owners,many=True)
        return Response({"owners":serializer.data},status=status.HTTP_200_OK)

class ownerDetailView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=ownerDetailSerializer
    def get(self,request):
        #get owner
        if request.user.role.role=="owner":
            serializer=ownerDetailsforAdminSerializer(request.user)
            return Response({"user":serializer.data},status=status.HTTP_200_OK)
        elif request.user.role.role=="agent":
            serializer= agentSerializer(request.user)
            return Response({"user":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":"you are not owner or agent"},status=status.HTTP_400_BAD_REQUEST)
    def put(self,request):
        #update owner
        serializer=ownerDetailSerializer(request.user,data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            return Response({"user":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

#block user
class blockUserView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    @extend_schema(
    parameters=[
            OpenApiParameter("user_id", OpenApiTypes.STR, OpenApiParameter.QUERY),
        ],
    )
    def post(self,request):
        user_id=request.query_params.get("user_id")
        print(user_id)
        if user_id is None:
            return Response({"message":"user_id is required"},status=status.HTTP_400_BAD_REQUEST)
        try:
            user=User.objects.get(id=user_id)
        except:
            return Response({"message":"user does not exist"},status=status.HTTP_400_BAD_REQUEST)
        user.is_active=False
        user.save()
        #if the user is owner then we block all his agents
        if user.role.role=="owner":
            for dep in user.account.department_set.all():
                for agent in dep.agents.all():
                    agent.is_active=False
                    agent.save()
        return Response({"message":"user blocked successfully"},status=status.HTTP_200_OK)

#unblock user
class unblockUserView(GenericAPIView):
    "unblock user if the user is owner then we block all his agents"
    permission_classes=[IsAuthenticated]
    @extend_schema(
    parameters=[
            OpenApiParameter("user_id", OpenApiTypes.STR, OpenApiParameter.QUERY),
        ],
    )
    def post(self,request):
        user_id=request.query_params.get("user_id")
        if user_id is None:
            return Response({"message":"user_id is required"},status=status.HTTP_400_BAD_REQUEST)
        try:
            user=User.objects.get(id=user_id)
        except:
            return Response({"message":"user does not exist"},status=status.HTTP_400_BAD_REQUEST)
        user.is_active=True
        user.save()
        #if the user is owner then we unblock all his agents
        if user.role.role=="owner":
            for dep in user.account.department_set.all():
                for agent in dep.agents.all():
                    agent.is_active=True
                    agent.save()
        return Response({"message":"user unblocked successfully"},status=status.HTTP_200_OK)


def send_verification_email(id):
    # Generate verification token
    try:
        user=User.objects.get(id=id)
    except:
        return Response({"message":"user does not exist"},status=status.HTTP_400_BAD_REQUEST)
    token = default_token_generator.make_token(user)
    uid = urlsafe_b64encode(force_bytes(user.id))
    uid_str = force_str(uid)
    verification_link = f"/activate/{uid_str}/{token}"
    
    # Construct verification link
    email_subject = 'Verify Your Email'
    email_message = f'Click the following link to verify your email: {env("front_end_host_url")+verification_link}'
    
    # Send email
    send_mail(email_subject, email_message,from_email=settings.DEFAULT_FROM_EMAIL,recipient_list=[user.email])

def send_password_reset_email(id):
    # Generate password reset token
    try:
        user=User.objects.get(id=id)
    except:
        return Response({"message":"user does not exist"},status=status.HTTP_400_BAD_REQUEST)
    token = default_token_generator.make_token(user)
    uid = urlsafe_b64encode(force_bytes(user.id))
    uid_str = force_str(uid)
    password_reset_link = f"/change-password/{uid_str}/{token}"
    
    # Construct password reset link
    email_subject = 'Reset Your Password'
    email_message = f'Click the following link to reset your password: {env("front_end_host_url")+password_reset_link}'
    
    # Send email
    send_mail(email_subject, email_message,from_email=settings.DEFAULT_FROM_EMAIL,recipient_list=[user.email])


class emailVerificationView(GenericAPIView):
    permission_classes=[AllowAny]
    def get(self, request, uidb64, token):
        User = get_user_model()
        try:
            uid = force_str(urlsafe_b64decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if default_token_generator.check_token(user, token):
            user.email_verified = True
            user.save()
            return Response({'detail': 'Email verified successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)

class resendVerificationEmailView(GenericAPIView):
    permission_classes=[AllowAny]
    @extend_schema(
    parameters=[
            OpenApiParameter("email", OpenApiTypes.EMAIL, OpenApiParameter.QUERY),
        ],
    )
    def post(self, request):
        email = request.query_params.get('email')
        if email is None:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User with given email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.email_verified:
            return Response({'detail': 'Email is already verified.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Send verification email
        t1 = threading.Thread(target=send_verification_email, args=(user.id,))
        t1.start()
        
        return Response({'detail': 'Verification email sent successfully.'}, status=status.HTTP_200_OK)

class changePasswordView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=changePasswordSerializer
    def post(self, request):
        
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if old_password is None or new_password is None:
            return Response({'detail': 'old_password and new_password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if old_password == new_password:
            return Response({'detail': 'New password must be different from old password.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not request.user.check_password(old_password):
            return Response({'detail': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.set_password(new_password)
        request.user.save()
        
        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)

class requestPasswordResetView(GenericAPIView):
    "send request to reset password to user email"
    permission_classes=[AllowAny]
    @extend_schema(
    parameters=[
            OpenApiParameter("email", OpenApiTypes.EMAIL, OpenApiParameter.QUERY),
        ],
    )
    def post(self, request):
        email = request.query_params.get('email')
        if email is None:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User with given email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Send password reset email
        t1 = threading.Thread(target=send_password_reset_email, args=(user.id,))
        t1.start()
        
        return Response({'detail': 'Password reset email sent successfully.'}, status=status.HTTP_200_OK)
    


class passwordResetView(GenericAPIView):
    permission_classes=[AllowAny]
    serializer_class=resetPasswordSerializer
    def post(self, request, uidb64, token):
        User = get_user_model()
        try:
            uid = force_str(urlsafe_b64decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid password reset link.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            if new_password is None:
                return Response({'detail': 'new_password is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()
            
            return Response({'detail': 'Password reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid password reset link.'}, status=status.HTTP_400_BAD_REQUEST)


class MyTokenView(TokenObtainPairView):
    """Custom token view to return user id and role in response and check is email verified and is active
    explaination:
    is_trial_active: check if the user is on the trial period : false if the user is on subscription whether is expired or not
    is_trial_expired: check if the user trial is expired
    is_subscription_expired: check if the user subscription is expired
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(username=request.data['username'])
        except User.DoesNotExist:
            return Response({'detail': 'User with given username does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        if user.role.role=="owner" and  not user.email_verified:
            return Response({'detail': 'Email is not verified.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.is_active:
            return Response({'detail': 'User is blocked.'}, status=status.HTTP_400_BAD_REQUEST)
        
        response.data['user_id'] = user.id
        response.data['role'] = user.role.role
        response.data['username'] = user.username
        response.data['notifications_count'] = user.received_notifications.filter(is_read=False).count()
        if user.role.role=="owner":
            #check if the user has active subscription or trial
            response.data["is_trial_active"]=user.account.accountstatus.is_trial_active
            #check if the user has trial expired
            response.data["is_trial_expired"]=user.account.accountstatus.is_trial_expired()
            #check if the user has subscription expired
            response.data["is_subscription_expired"]=user.account.accountstatus.is_subscription_expired()
        if user.role.role=="agent":
            response.data["is_trial_active"]=user.department_set.first().account.accountstatus.is_trial_active
            response.data["is_tria_expired"]=user.department_set.first().account.accountstatus.is_trial_expired()
            response.data["is_subscription_expired"]=user.department_set.first().account.accountstatus.is_subscription_expired()

        return response

from django.db.models import Sum,Count
from django.db.models.functions import Extract
from datetime import datetime
from payments.serializers import MonthlyMessagesSerializer

class ownerDashboardView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        if request.user.role.role=="owner":
            #get the number of messages
            departs=request.user.account.department_set.all()
            departments_number=departs.count()
            agents_number=AgentDepartment.objects.filter(department__in=departs).count()
            depart=request.user.account.department_set.first()
            
            read_conversations_number=Conversation.objects.filter(deparetment=depart,is_read=True).count()
            unread_conversations_number=Conversation.objects.filter(deparetment=depart,is_read=False).count()
            messages_number=Message.objects.filter(conversation__deparetment=depart).count()
            trial_ends_in=request.user.account.accountstatus.trial_end_date - timezone.now()
            
            subscription_ends_in=0
            if trial_ends_in.days<=0:
                trial_ends_in=0
                subscription_ends_in=request.user.account.accountstatus.subscription_end_date - timezone.now()
                subscription_ends_in=subscription_ends_in.days
            else:
                trial_ends_in=trial_ends_in.days
            data={
                    "departments_number":departments_number,
                    "agents_number":agents_number,
                    "read_conversations_number":read_conversations_number,
                    "unread_conversations_number":unread_conversations_number,
                    "messages_number":messages_number,
                    "trial_ends_in":trial_ends_in,
                    "subscription_ends_in":subscription_ends_in,
                }
            
            monthly_messages = Message.objects.filter(conversation__deparetment=depart).annotate(
                year=Extract('created_at', 'year'),
                month=Extract('created_at', 'month')
            ).values('year', 'month').annotate(
                messages_count=Count('id')
            ).order_by('year', 'month')

            # Find the first date in the payment list
            start_date_= datetime.now() - timedelta(days=365)
            start_date={}
            start_date["year"]=start_date_.year
            start_date["month"]=start_date_.month
            if start_date is not None:

                # Create a list of (year, month, messages_count) with zero amount for missing months
                current_date = datetime.now()
                all_months = [(start_date['year'], start_date['month'])]

                while (start_date['year'], start_date['month']) != (current_date.year, current_date.month):
                    if start_date['month'] == 12:
                        start_date = {'year': start_date['year'] + 1, 'month': 1}
                    else:
                        start_date = {'year': start_date['year'], 'month': start_date['month'] + 1}
                    all_months.append((start_date['year'], start_date['month']))

                # Convert monthly_payments into a dictionary with (year, month) as keys
                monthly_messages_dict = {(entry['year'], entry['month']): entry['messages_count'] for entry in monthly_messages}

                # Create a list of (year, month, messages_count) with zero amount for missing months
                monthly_messages_with_zero = [{'year': year, 'month': month, 'messages_count': monthly_messages_dict.get((year, month), 0)} for
                                            year, month in all_months]

                # Serialize the data
                serializer = MonthlyMessagesSerializer(
                    [{'date': f"{entry['year']}-{entry['month']:02}", 'messages_count': entry['messages_count']} for entry in
                    monthly_messages_with_zero],
                    many=True
                )
                data["monthly_messages"]=serializer.data
                return Response(data=data,status=status.HTTP_200_OK)
            else:
                return Response(data=data,status=status.HTTP_200_OK)
        elif request.user.role.role=="agent":
            depart=request.user.department_set.first()
            if depart is not  None:
                monthly_messages = Message.objects.filter(conversation__deparetment=depart).annotate(
                    year=Extract('created_at', 'year'),
                    month=Extract('created_at', 'month')
                ).values('year', 'month').annotate(
                    messages_count=Count('id')
                ).order_by('year', 'month')

                # Find the first date in the payment list
                start_date_= datetime.now() - timedelta(days=365)
                start_date={}
                start_date["year"]=start_date_.year
                start_date["month"]=start_date_.month
                if start_date is not None:
                    # Create a list of (year, month, messages_count) with zero amount for missing months
                    current_date = datetime.now()
                    all_months = [(start_date['year'], start_date['month'])]

                    while (start_date['year'], start_date['month']) != (current_date.year, current_date.month):
                        if start_date['month'] == 12:
                            start_date = {'year': start_date['year'] + 1, 'month': 1}
                        else:
                            start_date = {'year': start_date['year'], 'month': start_date['month'] + 1}
                        all_months.append((start_date['year'], start_date['month']))

                    # Convert monthly_payments into a dictionary with (year, month) as keys
                    monthly_messages_dict = {(entry['year'], entry['month']): entry['messages_count'] for entry in monthly_messages}

                    # Create a list of (year, month, messages_count) with zero amount for missing months
                    monthly_messages_with_zero = [{'year': year, 'month': month, 'messages_count': monthly_messages_dict.get((year, month), 0)} for
                                                year, month in all_months]

                    # Serialize the data
                    serializer = MonthlyMessagesSerializer(
                        [{'date': f"{entry['year']}-{entry['month']:02}", 'messages_count': entry['messages_count']} for entry in
                        monthly_messages_with_zero],
                        many=True
                    )
                    data={
                        "monthly_messages":serializer.data
                    }
                    return Response(data=data,status=status.HTTP_200_OK)
                else:
                    return Response(data=[],status=status.HTTP_200_OK)
            else:
                return Response(data=[],status=status.HTTP_200_OK)