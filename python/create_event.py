import common
import MySQLdb
import cgi

print "Content-type: text/html\n\n"
print common.ADMINS
if common.check_auth():
    data = cgi.FieldStorage();
    conn = MySQLdb.connect (host = "207.210.106.21",user = "cpboat",passwd = "ZH7bjgPZ",db = "cpboat")
    cursor = conn.cursor ()
    cursor.execute("insert into events(date) values(%s)", [data['date'].value])
    conn.commit()
    cursor.close()
    conn.close()
    print 'success'