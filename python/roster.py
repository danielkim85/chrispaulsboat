import common
import MySQLdb
import cgi

print "Content-type: text/html\n\n";
data = cgi.FieldStorage();
access_token = None;
profile = None;
my_id = None;

if "access_token" in data.keys():
    access_token = data['access_token'].value;
    profile = common.get_my_profile(access_token);
    my_id = profile['id'];

action = data['action'].value;
conn = common.conn_db();
cursor = conn.cursor ();
my_date = data['date'].value;

if action == 'join':
    #make sure i am friends with the t-pain
    if common.am_i_friends_w_t_pain(access_token):
        cursor.execute("insert into rosters(date,user,active) values(%s,%s,%s)", [my_date, my_id,1]);

elif action == 'withdraw':
    cursor.execute("update rosters set active = 0 where date = %s and user = %s", [my_date, my_id]);

elif action == 'check':
    cursor.execute("select count(id) from rosters where date = %s and user = %s and active = 1", [my_date, my_id]);
    rows = cursor.fetchall()
    print rows[0][0]
conn.commit();
cursor.close();
conn.close();