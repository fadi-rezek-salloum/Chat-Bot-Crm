import requests
import json
from environ import Env
from project.settings import env
import gc
def exchange_token(short_live_token,app_id,app_secret):
    try:
        facebook_exchange_url = f"https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_live_token}"
        
        response_facebook_exchange = requests.get(facebook_exchange_url)
        response_format_json = json.loads(response_facebook_exchange.content)
        access_token = response_format_json["access_token"]
        get_page_id=f"https://graph.facebook.com/v17.0/me?fields=id,name&access_token={access_token}"
        response_get_page_id=requests.get(get_page_id)
        response_format_json = json.loads(response_get_page_id.content)
        page_id=response_format_json["id"]
        print(page_id)
        #expires_in = response_format_json["expires_in"]

        return access_token,page_id
    except:
        return None,None


def exchange_token_instgram(short_live_token,app_id,app_secret):
    try:
        facebook_exchange_url = f"https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_live_token}"
        
        response_facebook_exchange = requests.get(facebook_exchange_url)
        response_format_json = json.loads(response_facebook_exchange.content)
        access_token = response_format_json["access_token"]
        get_page_id=f"https://graph.facebook.com/v17.0/me?fields=id,name&access_token={access_token}"
        response_get_page_id=requests.get(get_page_id)
        response_format_json = json.loads(response_get_page_id.content)
        page_id=response_format_json["id"]
        get_instagram_account_id=f"https://graph.facebook.com/v17.0/{page_id}?fields=instagram_business_account&access_token={access_token}"
        response_get_instagram_account_id=requests.get(get_instagram_account_id)
        response_format_json = json.loads(response_get_instagram_account_id.content)
        instagram_account_id=response_format_json["instagram_business_account"]["id"]
        print(f"instagram_account_id : {instagram_account_id}")


        return access_token,instagram_account_id
    except:
        return None,None

def exchange_token_whatsapp(short_live_token,app_id,app_secret):
    try:
        #exchange the token and get the whatsapp buisness account id
        facebook_exchange_url = f"https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_live_token}"
        response_facebook_exchange = requests.get(facebook_exchange_url)
        response_format_json = json.loads(response_facebook_exchange.content)
        print(response_format_json)
        access_token = response_format_json["access_token"]
        print(f"access_token : {access_token}")
        get_whatsapp_account_id=f"https://graph.facebook.com/v17.0/debug_token?input_token={access_token}"
        headers = {
            'Content-Type': 'application/json',
            "Authorization": f"Bearer {access_token}"
        }
        response_get_whatsapp_account_id=requests.get(get_whatsapp_account_id,headers=headers)
        response_format_json = json.loads(response_get_whatsapp_account_id.content)
        print(f"response_format_json : {response_format_json}")
        whatsapp_business_messaging_scope = response_format_json["data"]["granular_scopes"]
        for scope in whatsapp_business_messaging_scope:
            if scope["scope"] == "whatsapp_business_messaging":
                if scope["target_ids"] == []:
                    return None,None,None
                else :
                    waba = scope["target_ids"][0]

        url=f"https://graph.facebook.com/v17.0/{waba}/phone_numbers"
        params = {
            "access_token": access_token
        }
        headers = {
            'Content-Type': 'application/json'
        }
        res=requests.get(url,params=params,headers=headers)
        response_format_json = json.loads(res.content)
        print(f"response_format_json : {response_format_json}")
        first_id = response_format_json["data"][0]["id"]
        return access_token,waba,first_id
    except:
        return None,None,None



def subscribe_webhook_for_messaging(access_token,objet):
    params = {
        'access_token': access_token,
        'platform': objet,
        'callback_url': f"https://{env('ngrok_host')}/facebook/webhook/",
        'subscribed_fields': "messages,  messaging_postbacks",
        'verify_token': env("faceboob_webhook_verify_token") # Replace with your verify token
                }
    response = requests.post('https://graph.facebook.com/v17.0/me/subscribed_apps',params=params)
    response_format_json = json.loads(response.content)
    return response_format_json


def get_all_facebook_conversations(access_token):
    response=requests.get(url = 'https://graph.facebook.com/v17.0/me?fields=id,name,conversations.limit(20){messages.limit(1){message,created_time,from},unread_count,senders}'+f"&access_token={access_token}")
    response_format_json=json.loads(response.content)
    return response_format_json



def get_conversation_messages(conversation_id,access_token):
    response=requests.get(url = f'https://graph.facebook.com/v17.0/{conversation_id}/messages?fields=message&limit=10'+f"&access_token={access_token}")
    response_format_json=json.loads(response.content)
    return response_format_json


def sendMessage(access_token, recipient_id, message):
    print(gc.garbage.clear())

    url = f"https://graph.facebook.com/v17.0/me/messages"
    params = {
        "recipient": {"id": recipient_id},
        "messaging_type": "RESPONSE",
        "message": {"text": message},
        "access_token": access_token
    }
    response = requests.post(url,json=params)

    response_json = json.loads(response.content)

    return response_json



def sendWhatsappMessage(access_token,waba, recipient_id, message):
    """
    https://graph.facebook.com/v17.0/122102112548006631/messages
    
    {
    "messaging_product": "whatsapp",    
    "recipient_type": "individual",
    "to": "213561142190",
    "type": "text",
    "text": {
        "preview_url": false,
        "body": "ahlabi,"
    }
    }
    """
    url = f"https://graph.facebook.com/v17.0/{waba}/messages"
    data = {
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": recipient_id,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": message
        }
    }
    params = {
        "access_token": access_token
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url,json=data,params=params,headers=headers)

    response_json = json.loads(response.content)

    return response_json