from django.test import SimpleTestCase
from django.urls import reverse, resolve
from users.views import roleView,ownerView,requestPasswordResetView,passwordResetView,resendVerificationEmailView,changePasswordView,blockUserView,unblockUserView,ownerDetailView,getAllOwnersView
from rest_framework.test import APITestCase

class TestUrls(SimpleTestCase):
    
        def test_roles_url_resolves(self):
            url = reverse('roles')
            print(resolve(url))
            #roleview is viewsets.ModelViewSet so it not contain view_class
            self.assertEquals(resolve(url).func.cls, roleView)

    
        def test_owner_url_resolves(self):
            url = reverse('owner')
            print(resolve(url))
            self.assertEquals(resolve(url).func.view_class, ownerView)

class TestViews(APITestCase):
    def setUp(self):
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
    
    def test_roles_GET(self):
        url = reverse('roles')
        response = self.client.get(url)
        print(response.data)
        self.assertEquals(response.status_code, 200)
    
    def test_owner_POST(self):
        url = reverse('owner')
        data = {
            "first_name": "test1",
            "last_name": "test1",
            "email": "test1@gmail.com",
            "username": "test1",
            "password": "test1"
        }
        response = self.client.post(url, data)
        print(response.data)
        self.assertEquals(response.status_code, 201)

    
