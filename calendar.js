function renderCal(){
	
	
    $( "input[type=submit], a, button" )
      .button()
      .click(function( event ) {
        event.preventDefault();
      });
      	
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
	  		alert("You have joined!");
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
	  		alert("You have withdrawn!");
	  	});	
	});
 
 
 	$("#cancel").click(function(){
 		var date = $(".ui-dialog-title").html();
    	if(T_PAIN){
    		var r = confirm("Cancel " + date + "?");
    		if(r){
				$.ajax({
					type: "POST",
			  		url: "./python/event.py",
			  		data: { date: date, action:"cancel", access_token: ACCESS_TOKEN }
				})
			  	.done(function( msg ) {
			    	location.reload();
			  	});	    			
    		}
    	}
	});
    
    $('#calendar').fullCalendar({
	    eventClick: function(event) {
	    	$("#dialog").attr("title",event.start.format());
	        $( "#dialog" ).dialog();
	        $("#dialog").block({ message: null }); 
			$.ajax({
				type: "POST",
		  		url: "./python/roster.py",
		  		data: { action:"check", date: event.start.format(), access_token: ACCESS_TOKEN}
			})
		  	.done(function( msg ) {
		    	if(parseInt(msg) > 0){
		    		$("#withdraw").show();
		    		$("#join").hide();
		    		
		    	}
		    	else{
		    		$("#withdraw").hide();
		    		$("#join").show();
		    	}
		    	$("#dialog").unblock();
		  	});	    
	    },
	    dayClick: function(date, allDay, jsEvent, view) {            
	    	if(T_PAIN){
	    		var r = confirm("Create an event on " + date.format() + "?");
	    		if(r){
					$.ajax({
						type: "POST",
				  		url: "./python/event.py",
				  		data: { date: date.format(), action:"create", access_token: ACCESS_TOKEN }
					})
				  	.done(function( msg ) {
				    	location.reload();
				  	});	    			
	    		}
	    	}
	    },
	    loading: function(bool) {
		  if (!bool) 
		  	$("#calendar").unblock();
		  else
		  	$("#calendar").block({ message: null });
		},
		events: './python/event.py?action=get'

    });    
}


