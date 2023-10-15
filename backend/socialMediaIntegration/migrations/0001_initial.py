# Generated by Django 4.2.4 on 2023-10-13 10:11

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('departments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AccountSocialMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('social_media_account_id', models.CharField(blank=True, max_length=100, null=True)),
                ('token', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_message_time', models.DateTimeField(blank=True, null=True)),
                ('sender_username', models.CharField(default='', max_length=100)),
                ('sender_first_name', models.CharField(default='', max_length=100)),
                ('sender_last_name', models.CharField(default='', max_length=100)),
                ('is_read', models.BooleanField(default=False)),
                ('account_social_media', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialMediaIntegration.accountsocialmedia')),
                ('deparetment', models.ManyToManyField(to='departments.department')),
            ],
            options={
                'ordering': ['-last_message_time'],
            },
        ),
        migrations.CreateModel(
            name='SocialMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('facebook', 'facebook'), ('telegram', 'telegram'), ('instagram', 'instagram'), ('whatsapp', 'whatsapp')], max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_id', models.CharField(max_length=400, null=True)),
                ('created_at', models.DateTimeField(default=datetime.datetime.now)),
                ('message', models.TextField()),
                ('from_customer', models.BooleanField(default=True)),
                ('conversation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialMediaIntegration.conversation')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]