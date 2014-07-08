function renderCal(){
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
  	});		
	
	$("#join").click(function(){
		var date = $(".ui-dialog-title").html();
		console.info("joining the id " + MYID + " " + date);
		$.ajax({
			type: "POST",
	  		url: "./python/event.py",
	  		data: { date: date, access_token: ACCESS_TOKEN, action:"join" }
		})
	  	.done(function( msg ) {
	  	});	
	});
    
    $('#calendar').fullCalendar({
	    eventClick: function(event) {
	    	$("#dialog").attr("title",event.start.format());
	        $( "#dialog" ).dialog();
	    },
	    dayClick: function(date) {
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
		events: './python/event.py?action=get'

    });    
}
