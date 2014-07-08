import common
import MySQLdb
import cgi
print "Content-type: text/html\n\n"

data = cgi.FieldStorage();
action = data['action'].value;
profile = common.get_my_profile(data['access_token'].value)
conn = common.conn_db();
cursor = conn.cursor ();
my_id = profile['id'];
my_date = data['date'].value;

if action == 'join':
    #make sure i am friends with the t-pain
    cursor.execute("insert into rosters(date,user,active) values(%s,%s,%s)", [my_date, my_id,1]);
elif action == 'create':
    #make sure i am t-pain
    cursor.execute("insert into events(date) values(%s)", [my_date]);
elif action == 'get':
    #anyone
    cursor.execute("select * from events where date >= %s and date <= %s", [data['start'].value, data['end'].value]);
    rows = cursor.fetchall()
    print_ = "["
    for i in range(0,len(rows)):
        print_ += "{\"title\": \"Sign up\",\"start\":\"" + str(rows[i][1]).split(" ")[0] + "\"},"
    print_ = print_[:len(print_)-1]
    print_ += "]"
    print print_    

conn.commit();
cursor.close();
conn.close();