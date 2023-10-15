from datetime import datetime, timedelta
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from rest_framework import permissions

from users.models import Account, User
from .models import Payment,Subscription,Plan,Feature
from .serializers import featureSerializer,planSerializer,subscriptionSerializer

from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.plumbing import OpenApiParameter
from django.db.models import Sum
from socialMediaIntegration.models import Message
from .serializers import MonthlyPaymentSerializer
from django.db.models.functions import Extract
import requests
# Create your views here.

class featureView(GenericAPIView):
    
    serializer_class=featureSerializer
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        elif self.request.method == 'POST':
            return [permissions.IsAdminUser()]  
    #get all features from admin
    def get(self,request):
        #get the features
        features=Feature.objects.all()
        serializer=featureSerializer(features,many=True)
        return Response({"features":serializer.data},status=status.HTTP_200_OK)
    #create feature from admin
    def post(self,request):
        serializer=featureSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            feature=serializer.save()
            return Response({"feature":serializer.data},status=status.HTTP_201_CREATED)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

class featureDetailView(GenericAPIView):
    permission_classes=[IsAdminUser]
    serializer_class=featureSerializer
    #get feature from admin
    def get(self,request,pk):
        #get the feature
        feature=Feature.objects.get(pk=pk)
        serializer=featureSerializer(feature)
        return Response({"feature":serializer.data},status=status.HTTP_200_OK)
    #update feature from owner
    def put(self,request,pk):
        #get the admin
        try:
            feature=Feature.objects.get(pk=pk)
        except:
            return Response({"message":"feature does not exist"},status=status.HTTP_400_BAD_REQUEST)
        serializer=featureSerializer(feature,data=request.data)
        if serializer.is_valid():
            feature=serializer.save()
            return Response({"feature":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    #delete feature from admin
    def delete(self,request,pk):
        #get the admin
        feature=Feature.objects.get(pk=pk)
        if feature is None:
            return Response({"message":"feature does not exist"},status=status.HTTP_400_BAD_REQUEST)
        feature.delete()
        return Response({"message":"feature deleted successfully"},status=status.HTTP_200_OK)



class planView(GenericAPIView):
    serializer_class=planSerializer
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        elif self.request.method == 'POST':
            return [permissions.IsAdminUser]  
    #get all plans from admin
    def get(self,request):
        #get the plans
        plans=Plan.objects.all()
        serializer=self.serializer_class(plans,many=True)
        return Response({"plans":serializer.data},status=status.HTTP_200_OK)
    #create plan from admin
    def post(self,request):
        serializer=self.serializer_class(data=request.data,context={'request':request})
        if serializer.is_valid():
            plan=serializer.save()
            return Response({"plan":serializer.data},status=status.HTTP_201_CREATED)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

class planDetailView(GenericAPIView):
    serializer_class=planSerializer
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        elif self.request.method == 'PUT' or self.request.method=='DELETE':
            return [permissions.IsAdminUser()]  
    #get plan from admin
    def get(self,request,pk):
        #get the plan
        plan=Plan.objects.get(pk=pk)
        serializer=self.serializer_class(plan)
        return Response({"plan":serializer.data},status=status.HTTP_200_OK)
    #update plan from admin
    def put(self,request,pk):
        #get the plan
        try:
            plan=Plan.objects.get(pk=pk)
        except:
            return Response({"message":"plan does not exist"},status=status.HTTP_400_BAD_REQUEST)
        serializer=self.serializer_class(plan,data=request.data)
        if serializer.is_valid():
            plan=serializer.save()
            return Response({"plan":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    #delete plan from admin
    def delete(self,request,pk):
        #get the plan
        plan=Plan.objects.get(pk=pk)
        if plan is None:
            return Response({"message":"plan does not exist"},status=status.HTTP_400_BAD_REQUEST)
        plan.delete()
        return Response({"message":"plan deleted successfully"},status=status.HTTP_200_OK)


class subscriptionView(GenericAPIView):
    permission_classes=[IsAuthenticated,IsAdminUser]
    serializer_class=subscriptionSerializer
    #get all subscriptions from owner
    def get(self,request):
        #get the subscriptions
        #test if is owner return her subscriptions if is admin return all subscriptions
        if request.user.role.role=='owner':
            subscriptions=request.user.account.subscription_set.all()
        else:
            subscriptions=Subscription.objects.all()
        serializer=self.serializer_class(subscriptions,many=True)
        return Response({"subscriptions":serializer.data},status=status.HTTP_200_OK)
    #create subscription from owner

#get owner subscriptions with owner id 
class ownerSubscriptionView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=subscriptionSerializer
    #get all subscriptions from owner
    # add owner_id to url as params
    def get(self,request,owner_id):
        # get the owner with owner_id
        owner=User.objects.get(pk=owner_id)
        if owner is None:
            return Response({"message":"owner does not exist"},status=status.HTTP_400_BAD_REQUEST)
        if owner.role.role!='owner':
            return Response({"message":"user is not owner"},status=status.HTTP_400_BAD_REQUEST)
        #get the subscriptions
        subscriptions=owner.account.subscription_set.all()
        serializer=self.serializer_class(subscriptions,many=True)
        return Response({"subscriptions":serializer.data},status=status.HTTP_200_OK)

class subscriptionWebhook(GenericAPIView):
    permission_classes=[AllowAny]
    def post(self,request,owner_id):
        print(request.data)
        #create subscription for owner
        plan_id=request.query_params.get('plan_id')
        period=request.query_params.get('period')
        period=int(period)
        print(f"this owner id {owner_id}    \n this is plan_id {plan_id}  \ this period ={period}")
        if period in [30,120,365]:
            account=User.objects.get(id=str(owner_id)).account
            amount=request.data['cart_amount']
            currency=request.data['cart_currency']
            ref=request.data['tran_ref']
            payment_method=request.data['payment_info']['payment_method']
            status=request.data['payment_result']['response_status']

            pay=Payment.objects.create(amount=amount,currency=currency,transaction_id=ref,status=status,payment_method=payment_method)
            pay.save()
            if status=='A':
                plan=Plan.objects.get(pk=plan_id)
                end_date_=datetime.now()+timedelta(days=period)
                subscription=Subscription.objects.create(payment=pay,account=account,plan=plan,end_date=end_date_)
                subscription.save()
                account.accountstatus.is_trial_active=False
                account.accountstatus.subscription_start_date=datetime.now()
                account.accountstatus.subscription_end_date=end_date_
                account.accountstatus.save()
        return Response()

from project.settings import env

class paymentView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    @extend_schema(
    parameters=[
            OpenApiParameter("plan_id", OpenApiTypes.INT, OpenApiParameter.QUERY),
            OpenApiParameter("period", OpenApiTypes.INT, OpenApiParameter.QUERY)
        ],
    )
    def post(self,request):
        if request.user.role.role!='owner':
            return Response({"message":"user is not owner"},status=status.HTTP_400_BAD_REQUEST)
        try:
            plan_id=request.query_params.get('plan_id')
            period=request.query_params.get('period')
            period=int(period)
            plan=Plan.objects.get(pk=plan_id)
        except:
            return Response({"message":"plan or period does not exist"},status=status.HTTP_400_BAD_REQUEST)
        if period==30:
            price=plan.monthly_price
        elif period==120:
            price=plan.quarterly_price
        elif period==365:
            price=plan.yearly_price
        else:
            return Response({"message":"period does not exist"},status=status.HTTP_400_BAD_REQUEST)
        url ="https://secure.clickpay.com.sa/payment/request"
        data={
            "profile_id": int(env('click_pay_profil_number')),
            "tran_type": "sale",
            "tran_class": "ecom",
            "cart_id": "cart_11111",
            "cart_amount": price,
            "cart_currency": "EUR",
            "cart_description": "Description of the items/services",
            "paypage_lang": "en",
            "customer_details": {
                "name": "first-name last-name",
                "email": "name@email.com",
                "phone": "05xxxxxxxx",
                "street1": "address street",
                "city": "riyadh",
                "state": "riyadh",
                "country": "SA",
                "zip": "12345"
            },
            "hide_shipping":True,
            "callback": f"https://{env('ngrok_host')}/api/payments/webhook/clickpay/{request.user.id}?plan_id={plan_id}&period={period}"
        }
        headers = {'Content-type': 'application/json','authorization':env('clickpay_server_key') }
        response=requests.post(url,headers=headers,json=data)
        
        return Response(data=response.json(),status=status.HTTP_200_OK)

class DashBoardinfoForadmin(GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Get all owners
        owners_count = User.objects.filter(role__role="owner").count()
        agents_count = User.objects.filter(role__role="agent").count()
        messages_count = Message.objects.all().count()
        payment_amount = Payment.objects.all().aggregate(Sum('amount'))['amount__sum']
        monthly_payments = Payment.objects.annotate(
            year=Extract('created_at', 'year'),
            month=Extract('created_at', 'month')
        ).values('year', 'month').annotate(
            total_amount=Sum('amount')
        ).order_by('year', 'month')

        # Find the first date in the payment list
        start_date_= datetime.now() - timedelta(days=365)
        start_date={}
        start_date["year"]=start_date_.year
        start_date["month"]=start_date_.month

        # Create a list of (year, month, total_amount) with zero amount for missing months
        current_date = datetime.now()
        all_months = [(start_date['year'], start_date['month'])]

        while (start_date['year'], start_date['month']) != (current_date.year, current_date.month):
            if start_date['month'] == 12:
                start_date = {'year': start_date['year'] + 1, 'month': 1}
            else:
                start_date = {'year': start_date['year'], 'month': start_date['month'] + 1}
            all_months.append((start_date['year'], start_date['month']))

        # Convert monthly_payments into a dictionary with (year, month) as keys
        monthly_payments_dict = {(entry['year'], entry['month']): entry['total_amount'] for entry in monthly_payments}

        # Create a list of (year, month, total_amount) with zero amount for missing months
        monthly_payments_with_zero = [{'year': year, 'month': month, 'total_amount': monthly_payments_dict.get((year, month), 0)} for
                                      year, month in all_months]

        # Serialize the data
        serializer = MonthlyPaymentSerializer(
            [{'date': f"{entry['year']}-{entry['month']:02}", 'amount': entry['total_amount']} for entry in
             monthly_payments_with_zero],
            many=True
        )

        data = {
            "owners_count": owners_count,
            "agents_count": agents_count,
            "messages_count": messages_count,
            "payment_amount": payment_amount,
            "monthly_payments": serializer.data
        }
        return Response({"data": data}, status=status.HTTP_200_OK)
