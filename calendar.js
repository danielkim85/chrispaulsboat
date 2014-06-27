function renderCal(){
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        defaultDate: '2014-06-12',
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
				    	alert( "Data Saved.");
				    	//TODO refresh the calendar
				  	});	    			
	    		}
	    		console.info("create an event with : " + date.format());
	    	}
	    },
		events: [
			{
				title: 'All Day Event',
				start: '2014-06-01'
			},
			{
				title: 'Long Event',
				start: '2014-06-07',
				end: '2014-06-10'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2014-06-09T16:00:00'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2014-06-16T16:00:00'
			},
			{
				title: 'Meeting',
				start: '2014-06-12T10:30:00',
				end: '2014-06-12T12:30:00'
			},
			{
				title: 'Lunch',
				start: '2014-06-12T12:00:00'
			},
			{
				title: 'Birthday Party',
				start: '2014-06-13T07:00:00'
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: '2014-06-28'
			}
		]

    });
    if(myId == "10103785338762708"){
    	admin = true;
    }
    
}
