import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async,async_to_sync
from departments.models import AgentDepartment
from users.models import User
from channels.db import database_sync_to_async

class SocialMediaIntegrationConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_departments(self,user):
        if self.user_role == 'owner':
            return user.account.department_set.all()
        elif self.user_role == 'agent':
            return AgentDepartment.objects.get(agent=user).department

    @database_sync_to_async
    def get_user_role(self ,user_id):
        return User.objects.get(pk=user_id).role.role

    async def connect(self):
        await self.accept()
        self.user = self.scope['user']
        self.user_role=await self.get_user_role(self.user.id)

        await self.add_user_to_group()




    async def disconnect(self, close_code):
        await self.remove_user_from_group()


    async def message_send(self, event):
        message = event['value']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    
    

    async def add_user_to_group(self):
        print(self.user_role)
        departments =  await self.get_departments(self.user)
        if self.user_role == 'owner':
            await self.add_user_to_departments(departments)
        elif self.user_role == 'agent':
            await self.add_agent_to_department(departments)

    @sync_to_async
    def add_user_to_departments(self,departments):
        for department in departments:
            async_to_sync(self.channel_layer.group_add)(
                    str(department.id),
                    self.channel_name
                )
    
    @sync_to_async
    def add_agent_to_department(self,department):
        async_to_sync(self.channel_layer.group_add)(
                    str(department.id),
                    self.channel_name
                )

    async def remove_user_from_group(self):
            departments = await self.get_departments(self.user)
            if self.user_role == 'owner':
                await self.remove_user_from_departments(departments)
            elif self.user_role == 'agent':
                await self.remove_agent_from_department(departments)
                
                
    @sync_to_async
    def remove_user_from_departments(self,departments):
        for department in departments:
            async_to_sync(self.channel_layer.group_discard)(
                    str(department.id),
                    self.channel_name
                )

    @sync_to_async
    def remove_agent_from_department(self,department):
        async_to_sync(self.channel_layer.group_discard)(
                    str(department.id),
                    self.channel_name
                )

