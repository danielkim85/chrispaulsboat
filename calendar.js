function renderCal(){
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        //defaultDate: '2014-06-12',
	    eventClick: function() {
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
    if(myId == "10103785338762708"){
    	admin = true;
    }
    
}
