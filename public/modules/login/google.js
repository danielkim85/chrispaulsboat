function loadScript(url, type, charset) {
  if (type===undefined) type = 'text/javascript';
  if (url) {
    var script = document.querySelector("script[src*='"+url+"']");
    if (!script) {
      var heads = document.getElementsByTagName("head");
      if (heads && heads.length) {
        var head = heads[0];
        if (head) {
          script = document.createElement('script');
          script.setAttribute('src', url);
          script.setAttribute('type', type);
          if (charset) script.setAttribute('charset', charset);
          head.appendChild(script);
        }
      }
    }
    return script;
  }
}

function onFailure(error) {
  console.error(error);
}

function onSuccess(googleUser) {
  if(window.user){
    return;
  }
  var profile = googleUser.getBasicProfile();
  window.user = {
    type:'google',
    email:profile.getEmail(),
    name:profile.getName(),
    picture:profile.getImageUrl(),
    accessToken : {
      type:'google',
      token:googleUser.getAuthResponse().id_token
    }
  }
}

function renderButton() {
  gapi.signin2.render('gSignin', {
    'scope': 'profile email',
    'width': 200,
    'height': 40,
    'longtitle': false,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}