function renderCal(){
	$("#join").click(function(){
		var date = $(".ui-dialog-title").html();
		console.info("joining the id " + MYID + " " + date);
		$.ajax({
			type: "POST",
	  		url: "python/join_event.py",
	  		data: { date: date, access_token: ACCESS_TOKEN }
		})
	  	.done(function( msg ) {
	  	});	
	});
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        //defaultDate: '2014-06-12',
	    eventClick: function(event) {
	    	$("#dialog").attr("title",event.start.format());
	        $( "#dialog" ).dialog();
	    },
	    dayClick: function(date) {
	    	if(admin){
	    		var r = confirm("Create an event on " + date.format() + "?");
	    		if(r){
					$.ajax({
						type: "POST",
				  		url: "python/create_event.py",
				  		data: { date: date.format() }
					})
				  	.done(function( msg ) {
				    	location.reload();
				  	});	    			
	    		}
	    		console.info("create an event with : " + date.format());
	    	}
	    },
		events: '/python/get_events.py'

    });
    if(MYID == "10103785338762708"){
    	admin = true;
    }
    
}
