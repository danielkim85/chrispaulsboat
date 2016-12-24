#!/usr/bin/python

import facebook
import MySQLdb
import config

def conn_db():
    return MySQLdb.connect (host = config.DB_HOST, user = config.DB_USER, passwd = config.DB_PWD, db = config.DB_NAME);

def get_my_profile(access_token):
    graph = facebook.GraphAPI(access_token);
    profile = graph.get_object("me");
    return profile;

def am_i_t_pain(access_token):
    my_id = get_my_profile(access_token)['id'];
    if my_id in config.T_PAIN:
        return True;
    else:
        return False;
    
def am_i_friends_w_t_pain(access_token):
    graph = facebook.GraphAPI(access_token)
    if am_i_t_pain(access_token):
        return True;
    for t_pain in config.T_PAIN:
        if len(graph.get_object("me/friends/" + t_pain)['data']) > 0:
            return True;
    return False;