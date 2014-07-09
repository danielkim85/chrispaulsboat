#!/usr/bin/python

import common
import facebook
import os
import urllib2
print "Content-type: text/html\n\n"
graph = facebook.GraphAPI("CAAUiHKYqNEQBAC1ZB5IM9Xa7yeShQs5BcwH4AA6v9y8TUHnI2A6hnLuwoVLZCtlEFnEJ9gypKHXaXkU6Uw9XkbQWaz7LnIQZA9fo6zcZAiVuEXw01bGD6f54M4vZCO8LZBAoGdKfHIOJ4KP0c1reZC9TZCHzu9d0G71gQaG33TIdwwWzxKhGg722XP1BCvZBycZCgZD")
profile = graph.get_object("10103789738051498")
print profile
#posts = graph.get_connections(profile['id'])