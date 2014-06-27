FACEBOOK_APP_ID = "1444881325765700"
FACEBOOK_APP_SECRET  = "b348a7b91b8425944ff5d566d412b7f8"

import facebook
import os
import urllib2

def check_auth():
    #try:
    cookies = {"fbsr_" + FACEBOOK_APP_ID:os.environ.get('HTTP_COOKIE').split("fbsr_" + FACEBOOK_APP_ID + "=")[1]}
    cookie = facebook.get_user_from_cookie(cookies, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET)
    #except:
    
    if cookie["uid"] != '':
        return True
    else:
        return False
