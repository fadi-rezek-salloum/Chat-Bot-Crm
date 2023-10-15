# Generated by Django 4.2.4 on 2023-09-04 10:42

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notifications', '0002_notification_conversation_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='user',
        ),
        migrations.AddField(
            model_name='notification',
            name='user',
            field=models.ManyToManyField(related_name='received_notifications', to=settings.AUTH_USER_MODEL),
        ),
    ]