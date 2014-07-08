import common
import cgi

print "Content-type: text/html\n\n";

data = cgi.FieldStorage();
access_token = data['access_token'].value;
print_ = "{\"t_pain\":\"";
print_ += "1" if common.am_i_t_pain(access_token) else "0";
print_ += "\",\"friends\":\"";
print_ += "1" if common.am_i_friends_w_t_pain(access_token) else "0";
print_ += "\"}";

print print_

