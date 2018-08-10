(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
  if(window.user && window.user.type !== 'anon'){
    return;
  }

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      FB.api('/me?fields=name,id,picture,email', function(response) {
        window.user = {
          type:'facebook',
          email:response.email,
          name:response.name,
          picture:response.picture.data.url
        };
      });
    }
  });
}


window.fbAsyncInit = function() {

  FB.init({
    appId      : '1444881325765700',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v3.0' // use graph api version 2.8
  });
  checkLoginState();
};