import facebook
import MySQLdb
import config

T_PAIN = ["10103785338762708"]

def conn_db():
    return MySQLdb.connect (host = config.DB_HOST, user = config.DB_USER, passwd = config.DB_PWD, db = config.DB_NAME);

def get_my_profile(access_token):
    graph = facebook.GraphAPI(access_token);
    profile = graph.get_object("me");
    return profile;

def am_i_t_pain(access_token):
    my_id = get_my_profile(access_token)['id'];
    if my_id in T_PAIN:
        return True;
    else:
        return False;