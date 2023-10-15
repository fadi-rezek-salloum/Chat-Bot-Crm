# Generated by Django 4.2.4 on 2023-10-13 10:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('socialMediaIntegration', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='accountsocialmedia',
            name='account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.account'),
        ),
        migrations.AddField(
            model_name='accountsocialmedia',
            name='social_media',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialMediaIntegration.socialmedia'),
        ),
    ]
