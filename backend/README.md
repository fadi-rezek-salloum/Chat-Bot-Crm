# Social Media Integration API (chatbotCrm)

## Overview

This project is an API that combines social media platforms such as Facebook, Instagram, WhatsApp, and Telegram into a single unified interface. It utilizes Django, Django REST framework, Daphne for asynchronous support, Django Channels for real-time functionality, and Redis as a message broker.

## Installation

Follow these steps to set up the project on your local machine:

### Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```
### Set Up a Virtual Environment
```bash
pip install virtualenv
virtualenv <env-name>
```

Ensure your project structure looks like this:

```bash
<env-name>/  # Your virtual environment
project/ 
users/
manage.py
.env  # Create this file and add the environment variables listed 
below
requirements.txt
```
### Environment Variables
```bash
Django_SECRET_KEY='django-insecure-y@c7j6uhvt02o4o(kw+(yf+a3^vc+$ys^q_!=2$)8$kq9me$(%'
facebook_app_id="202771326109753"
facebook_app_secret="f8b947df914ece2591d31abea350de38"
facebook_webhook_verify_token="123456"
ngrok_host="385c-46-193-4-57.ngrok-free.app"
ngrok_host_full="http://127.0.0.1:8000"
default_department_name="service client"
free_trial_days="10"
clickpay_server_key="S6JNLRHJTH-JH26JGRMDG-GNBWWGKKJK"
front_end_host_url="http://127.0.0.1:3000"
click_pay_profil_number="43681"
```
when you deploy you have to change the ngrok_host to the domaine name of the new host 
```bash
example : chatbotCrm.com
```
and also  the front_end_host_url 
```bash
example: http://chatbotCrm.com:3000
```
the clickpay also the profile number and the server key

### Activate the Virtual Environment
```bash
source <env-name>/bin/activate  
# On Windows: .\<env-name>\Scripts\activate
```

### Install Requirements
```bash
pip install -r requirements.txt
```

### Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create a Superuser
```bash
python manage.py createsuperuser
```

### Run the Server
#### note : runserver is for the developement mode make
```bash
python manage.py runserver
```

### Redis
Make sure you have Redis running. You can run it using Docker
```bash
docker run --rm -p 6379:6379 redis:7
```
### realtime endpoint
```bash
ws://127.0.0.1:8000/ws/socialMediaIntegration?token=""
ws://127.0.0.1:8000/ws/notification?token=""

note : 127.0.0.1:8000 we are in dev mode
```
### API documentation
using drf_spectucular
```bash
http://127.0.0.1:8000/api/schema/swagger-ui/#/

```
# TO change
### change Email settings
* project/settings.py 
```bash
EMAIL_HOST_USER=""
EMAIL_HOST_PASSWORD=""
DEFAULT_FROM_EMAIL=""
```

### change Email settings
* project/settings.py 
```bash
EMAIL_HOST_USER=""
EMAIL_HOST_PASSWORD=""
DEFAULT_FROM_EMAIL=""
```
