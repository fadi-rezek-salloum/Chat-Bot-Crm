from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase

from users.models import Role
from .views import DepartmentView,DepartmentDetailView,agentView,agentDetailView
from users.models import User



class TestViews(APITestCase):

    token=''
    agent_id=""
    def authentification(self):
        data = {
            "username": "test",
            "password": "test"
        }
        response = self.client.post(reverse('token_obtain_pair'), data)
        self.assertEquals(response.status_code, 200)
        self.token=response.data['access']
    def add_roles(self):
        Role.objects.create(role="agent")
        Role.objects.create(role="owner")
        Role.objects.create(role="admin")
    
    def setUp(self):
        self.add_roles()
        #create owner to can get agents and other things
        url = reverse('owner')
        data = {
            "first_name": "test",
            "last_name": "test",
            "email": "test@gmail.com",
            "username": "test",
            "password": "test"
        }
        response = self.client.post(url, data)
        print(response.data)
        self.assertEquals(response.status_code, 201)
        #get access self.token of owner to can get agents and other things
        self.authentification()
        #create two departments
        url = reverse('departments')
        data = {
            "department_name": "test",
            "description": "test",
        }
        data1 = {
            "department_name": "test1",
            "description": "test1",
        }
        response = self.client.post(url,data,HTTP_AUTHORIZATION='Bearer '+self.token)
        response1 = self.client.post(url,data1,HTTP_AUTHORIZATION='Bearer '+self.token)
        self.assertEquals(response.status_code, 201)
        #create two agents
        url = reverse('agents')
        data = {
            "first_name": "agent",
            "last_name": "agent",
            "username": "agent",
            "email": "agnet@gmail.com",
            "phone_number": "",
            "password": "agent",
            "department_id":response.data['department']['id']
        }

        data1 = {
            "first_name": "agent1",
            "last_name": "agent1",
            "username": "agent1",
            "email": "agnet1@gmail.com",
            "phone_number": "",
            "password": "agent1",
            "department_id":response.data['department']['id']
        }
        response = self.client.post(url,data,HTTP_AUTHORIZATION='Bearer '+self.token,format='json')
        self.agent_id=response.data['agent']['id']
        #print("this is reponse{}".format(response.data))
        response1=self.client.post(url,data1,HTTP_AUTHORIZATION='Bearer '+self.token,format='json')
        self.assertEquals(response.status_code, 201)


    def test_departments_GET(self):
        #get access self.token of owner to can get departments
        url = reverse('departments')
        response = self.client.get(url,HTTP_AUTHORIZATION='Bearer '+self.token)
        self.assertEquals(response.status_code, 200)
        self.assertContains(response,'departments')
        self.assertEquals(response.data['departments'][0]['department_name'],'test')
        self.assertEquals(response.data['departments'][0]['description'],'test')
    
    def test_departments_POST(self):
        #get access self.token of owner to can create departments
        
        url = reverse('departments')
        data = {
            "department_name": "test1",
            "description": "test1",
        }
        response = self.client.post(url,data,HTTP_AUTHORIZATION='Bearer '+self.token)
        
        self.assertEquals(response.status_code, 201)
        self.assertEquals(response.data['department']['department_name'],'test1')
        self.assertEquals(response.data['department']['description'],'test1')

    def test_departments_detail_GET(self):
        #get access self.token of owner to can get departments
        
        url = reverse('department-detail',kwargs={'pk':1})
        response = self.client.get(url,HTTP_AUTHORIZATION='Bearer '+self.token)
        
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data['department']['department_name'],'test')
        self.assertEquals(response.data['department']['description'],'test')

    def test_departments_detail_PUT(self):
        #get access self.token of owner to can update departments
        
        url = reverse('department-detail',kwargs={'pk':1})
        data = {
            "department_name": "test1",
            "description": "test1",
        }
        print(url)
        response = self.client.put(url,data,HTTP_AUTHORIZATION='Bearer '+self.token)
        
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data['department']['department_name'],'test1')
        self.assertEquals(response.data['department']['description'],'test1')

    def test_departments_detail_DELETE(self):
        #get access self.token of owner to can delete departments
        
        url = reverse('department-detail',kwargs={'pk':1})
        response = self.client.delete(url,HTTP_AUTHORIZATION='Bearer '+self.token)
        
        self.assertEquals(response.status_code, 200)
    

    def test_agents_GET(self):
        
        url = reverse('agents')
        response = self.client.get(url,HTTP_AUTHORIZATION='Bearer '+self.token)
        print(response.data)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data['agents'][0]['first_name'],'agent')
        self.assertEquals(response.data['agents'][0]['last_name'],'agent')
        self.assertEquals(response.data['agents'][0]['username'],'agent')
        self.assertEquals(response.data['agents'][0]['department_name'],'test')
    def test_agents_POST(self):
        
        url = reverse('agents')
        data={
            "first_name": "agent2",
            "last_name": "agent2",
            "username": "agent2",
            "email": "agent2@gmail.com",
            "phone_number": "",
            "password": "agent2",
            "department_id":2
        }

        response = self.client.post(url,data,HTTP_AUTHORIZATION='Bearer '+self.token)
        self.assertEquals(response.status_code, 201)
        self.assertEquals(response.data['agent']['first_name'],'agent2')
        self.assertEquals(response.data['agent']['last_name'],'agent2')
        self.assertEquals(response.data['agent']['username'],'agent2')
    # unite test for agent detail
    def test_agents_detail_GET(self):
            url = reverse('agent-detail',kwargs={'pk':self.agent_id})
            response = self.client.get(url,HTTP_AUTHORIZATION='Bearer '+self.token)
            print(response.data)
            self.assertEquals(response.status_code, 200)
            self.assertEquals(response.data['agent']['first_name'],'agent')
            self.assertEquals(response.data['agent']['last_name'],'agent')
            self.assertEquals(response.data['agent']['username'],'agent')
            self.assertEquals(response.data['agent']['department_name'],'test')

    def test_agents_detail_PUT(self):
            url = reverse('agent-detail',kwargs={'pk':self.agent_id})
            data={
                "first_name": "agent2",
                "last_name": "agent2",
                "username": "agent2",
                "email": "agent2@gmail.com",
                "phone_number": "",
                "password": "agent2",
                "department_id":2
            }
            response = self.client.put(url,data,HTTP_AUTHORIZATION='Bearer '+self.token)
            self.assertEquals(response.status_code, 200)
            self.assertEquals(response.data['agent']['first_name'],'agent2')
            self.assertEquals(response.data['agent']['last_name'],'agent2')
            self.assertEquals(response.data['agent']['username'],'agent2')
    
    def test_agents_detail_DELETE(self):
            url = reverse('agent-detail',kwargs={'pk':self.agent_id})
            response = self.client.delete(url,HTTP_AUTHORIZATION='Bearer '+self.token)
            self.assertEquals(response.status_code, 200)