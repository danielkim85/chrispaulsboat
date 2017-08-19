var T_PAIN = false;
var T_PAIN_FRIENDS = false;
var MY_ID = null;
var ACCESS_TOKEN = null;
var MOBILE = false;

function statusChangeCallback(response) {
	
	if (response.status === 'connected') {
  	// Logged into your app and Facebook.
		ACCESS_TOKEN =   FB.getAuthResponse()['accessToken'];
    loadInfo();

	} else if (response.status === 'not_authorized') {
		// The person is logged into Facebook, but not your app.
		//document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
	} else {
		// The person is not logged into Facebook, so we're not sure if
		// they are logged into this app or not.
		//document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
 	}
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
  		statusChangeCallback(response);
	});
}

var logout_event = function(response) {
	location.reload();
}

window.fbAsyncInit = function() {
	FB.init({
    appId      : '1444881325765700',
		cookie     : true,  // enable cookies to allow the server to access 
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.0' // use version 2.0
  });

	FB.getLoginStatus(function(response) {
  	statusChangeCallback(response);
	});
	
	FB.Event.subscribe('auth.logout', logout_event);
};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loadInfo() {
	FB.api('/me',  function(response) {
		MY_ID = response.id;
  	if(window.location.href.startsWith('http://dev.')){
  		console.info('User\'s ID:' + MY_ID);
  		console.info('ACCESS TOKEN:' + ACCESS_TOKEN);
  	}
  	document.getElementById('status').innerHTML =
		'Hello, ' + response.name + '!';
      	
		//check if t-pain is in town
		$.ajax({
			type: "POST",
	  		url: "./python/t_pain.py",
	  		data: { access_token: ACCESS_TOKEN },
	  		dataType : "json"
		})
	  	.done(function( json ) {
	  		T_PAIN = json.t_pain == "1";
	  		T_PAIN_FRIENDS = json.friends == "1";
	  		if(T_PAIN){
	  			$("#cancel").show();
	  		}
	  		if(!T_PAIN_FRIENDS){
	  			$("#action").hide();
	  			$("#know_t_pain_first").show();
	  		}
	  	});		
	
    });
}

function renderCal(){
  $('#calendar').fullCalendar({
  	height: 400,
    eventClick: function(event) {
    	if(MY_ID == null){
    		$( "#dialogMsg p" ).html('You must log in to join or view the roster!');
    		$( "#dialogMsg" ).dialog();
    	}
			else{
		    $("#roster").html("");
	      $("#dialog" ).dialog({title : event.start.format()});
	      $("#dialog").block({ message: null }); 

				$.ajax({
					type: "POST",
			  		url: "./python/roster.py",
			  		data: { action:"check", date: event.start.format(), access_token: ACCESS_TOKEN}
				}).done(function( msg ) {
			    	if(parseInt(msg) > 0){
			    		$("#withdraw").show();
			    		$("#join").hide();
			    		
			    	}
			    	else{
			    		$("#withdraw").hide();
			    		$("#join").show();
			    	}
					$.ajax({
						type: "POST",
				  		url: "./python/roster.py",
				  		data: { date: event.start.format(), action:"get"},
				  		dataType:"json"
					}).done(function( json ) {
						if(json.length > 0){
							$("#compete").show();
							$("#no_compete").hide();
						}
						else{
							$("#compete").hide();
							$("#no_compete").show();						
						}
			    	for(var i = 0; i < json.length; i++){
						FB.api(json[i].user,  function(response) {
							$("#roster").append("<div style='margin-bottom:5px;'><a target='_blank' href='" + response.link + "'>" + response.name+ "</a></div>");
					    });	
			    	}
			    	$("#dialog").unblock();
				  });			  		    	
		  	});	  
		  }  
    },
    dayClick: function(date, allDay, jsEvent, view) {
    	console.info('day click');      
    	if(T_PAIN){
    		$( "#dialogConfirm p" ).html("Create an event on " + date.format() + "?");
		    $( "#dialogConfirm" ).dialog({
		      buttons: {
		       	OK: function() {
		       		var that = this;
							$.ajax({
								type: "POST",
						  		url: "./python/event.py",
						  		data: { date: date.format(), action:"create", access_token: ACCESS_TOKEN }
							})
					  	.done(function( msg ) {
					  		$( that ).dialog( "close" );
								$('#calendar').fullCalendar('refetchEvents');
					  	});
		        },
		        Cancel: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });
    	}
    },
    loading: function(bool) {
		  if (!bool) 
		  	$(".fc-content").unblock();
		  else
		  	$(".fc-content").block({ message: null });
		},
		//get how many ppl joined in (5)
		events: './python/event.py?action=get'
  });
}

$(document).ready(function(){
	$( "input[type=submit], button" )
	.button()
	.click(function( event ) {
	  event.preventDefault();
	});

	$("#join").click(function(){
		var date = $(".ui-dialog-title").html();
		$.ajax({
			type: "POST",
	  		url: "./python/roster.py",
	  		data: { date: date, access_token: ACCESS_TOKEN, action:"join" }
		})
	  	.done(function( msg ) {
	  		$( "#dialog" ).dialog("close");
				$( "#dialogMsg p" ).html('You have joined!');
				$( "#dialogMsg" ).dialog();
				$('#calendar').fullCalendar('refetchEvents');
	  	});	
	});
 
 	$("#withdraw").click(function(){
		var date = $(".ui-dialog-title").html();
		$.ajax({
			type: "POST",
	  		url: "./python/roster.py",
	  		data: { date: date, access_token: ACCESS_TOKEN, action:"withdraw" }
		})
  	.done(function( msg ) {
  		$( "#dialog" ).dialog("close");
			$( "#dialogMsg p" ).html('You have withdrawn!');
			$( "#dialogMsg" ).dialog();
			$('#calendar').fullCalendar('refetchEvents');
  	});	
	});
 
 	$("#cancel").click(function(){
 		$( "#dialog" ).dialog("close");
 		var date = $(".ui-dialog-title").html();
  	if(T_PAIN){
  		$( "#dialogConfirm p" ).html("Cancel " + date + "?");
	    $( "#dialogConfirm" ).dialog({
	      buttons: {
	       	OK: function() {
	       		var that = this;
						$.ajax({
							type: "POST",
					  		url: "./python/event.py",
					  		data: { date: date, action:"cancel", access_token: ACCESS_TOKEN }
						})
				  	.done(function( msg ) {
				  		$( that ).dialog( "close" );
							$('#calendar').fullCalendar('refetchEvents');
				  	});
	        },
	        Cancel: function() {
	          $( this ).dialog( "close" );
	        }
	      }
	    });
    }
	});

	if(  !document.addEventListener  ){
		$( "#dialogMsg p" ).html('You can\'t ride the boat with IE 9.');
		$( "#dialogMsg" ).dialog();
 	}

	renderCal();

	//mobile optimazation
	MOBILE = jQuery.browser.mobile;
	if(MOBILE){
		$("#images").hide();
		$("#main, body, html").css("width","800px");
		$("#main, body, html").css("height","600px");
	}
});