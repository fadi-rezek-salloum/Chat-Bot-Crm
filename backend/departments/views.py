from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import Department
from .serializers import departmentSerializer
from users.models import User
from .serializers import agentSerializer

# Create your views here.

class DepartmentView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=departmentSerializer
    #get all departments from owner
    def get(self,request):
        #get the departments
        departments=request.user.account.department_set.all()
        serializer=departmentSerializer(departments,many=True)
        return Response({"departments":serializer.data},status=status.HTTP_200_OK)
    #create department from owner
    def post(self,request):
        serializer=departmentSerializer(data=request.data,context={'request':request})

        if serializer.is_valid():
            department=serializer.save()
            return Response({"department":serializer.data},status=status.HTTP_201_CREATED)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

class DepartmentDetailView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=departmentSerializer
    #get department from owner
    def get(self,request,pk):
        #get the department
        department=request.user.account.department_set.get(pk=pk)
        serializer=departmentSerializer(department)
        return Response({"department":serializer.data},status=status.HTTP_200_OK)
    #update department from owner
    def put(self,request,pk):
        #get the department
        try:
            department=request.user.account.department_set.get(pk=pk)
        except:
            return Response({"message":"department does not exist"},status=status.HTTP_400_BAD_REQUEST)
        serializer=departmentSerializer(department,data=request.data)
        if serializer.is_valid():
            department=serializer.save()
            return Response({"department":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    #delete department from owner
    def delete(self,request,pk):
        #get the department
        department=Department.objects.get(pk=pk)
        if department is None:
            return Response({"message":"department does not exist"},status=status.HTTP_400_BAD_REQUEST)
        department.delete()
        return Response({"message":"department deleted successfully"},status=status.HTTP_200_OK)



class agentView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=agentSerializer
    #get all agents from owner
    def get(self,request):
        #get the agents from owner account departments
        #agents are in the departments of an account of an owner 
        departments=request.user.account.department_set.all()
        agents=[]
        for department in departments:
            agents+=list(department.agents.all())
        serializer=agentSerializer(agents,many=True)
        return Response({"agents":serializer.data},status=status.HTTP_200_OK)
    #create agent from owner
    def post(self, request):
        serializer = agentSerializer(data=request.data)
        if serializer.is_valid():
            agent_data = serializer.save()
            return Response({"agent": agent_data}, status=status.HTTP_201_CREATED)
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class agentDetailView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=agentSerializer
    #get agent from owner
    def get(self,request,pk):
        #get the agent
        try:
            agent=User.objects.get(pk=pk)
        except:
            return Response({"message":"agent does not exist"},status=status.HTTP_400_BAD_REQUEST)
        serializer=self.serializer_class(agent)
        return Response({"agent":serializer.data},status=status.HTTP_200_OK)
    #update agent from owner
    def put(self,request,pk):
        #get the agent
        try:
            agent=User.objects.get(pk=pk)
        except:
            return Response({"message":"agent does not exist"},status=status.HTTP_400_BAD_REQUEST)
        serializer=self.serializer_class(data=request.data,context={'request':request})
        if serializer.is_valid():
            agent=serializer.update(agent,serializer.validated_data)
            return Response({"agent":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    #delete agent from owner
    def delete(self,request,pk):
        agent=User.objects.get(pk=pk)
        if agent is None:
            return Response({"message":"agent does not exist"},status=status.HTTP_400_BAD_REQUEST)
        agent.delete()
        return Response({"message":"agent deleted"},status=status.HTTP_200_OK)
