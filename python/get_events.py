import common
import MySQLdb
import cgi

print "Content-type: text/html\n\n"
#if common.check_auth():
data = cgi.FieldStorage();
conn = common.conn_db();
cursor = conn.cursor ();
#cursor.execute("insert into events(date) values(%s)", [data['date'].value])
cursor.execute("select * from events where date >= %s and date <= %s", [data['start'].value, data['end'].value])
rows = cursor.fetchall()
print_ = "["
for i in range(0,len(rows)):
    print_ += "{\"title\": \"Sign up\",\"start\":\"" + str(rows[i][1]).split(" ")[0] + "\"},"
print_ = print_[:len(print_)-1]
print_ += "]"
conn.commit()
cursor.close()
conn.close()
print print_