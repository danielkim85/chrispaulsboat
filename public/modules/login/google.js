function onFailure(error) {
  console.log(error);
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
    picture:profile.getImageUrl()
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