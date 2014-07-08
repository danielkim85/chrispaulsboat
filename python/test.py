import common
import facebook
import os
import urllib2
print "Content-type: text/html\n\n"
graph = facebook.GraphAPI("CAAUiHKYqNEQBAJZAZB8Pw4P0LyjzgzYjtMYypp7ca3ZBsXCaQnUwlFGrkCAa5VwIADbpNjCZAXV611YaCudH7sGrvvFZA5zGRMZBcbIirf7BBzYrsxrZBECRZA9YlhQVl7ZC6tTej8XTM8zxth0usAJBHZBcVzkQlzZC9vrHglrW55PvZAZAUGEYeRvlzzdYGLSbgZCisZD")
profile = graph.get_object("/me")
print profile
#posts = graph.get_connections(profile['id'])