/*Constructor */
function EventHub(){

	this.events = {};
}

/* Subscribe to an event

	Callback has signature - callback(data)
	OnError has signature - onerror(error)
*/

EventHub.prototype.subscribe = function(subscriber, event, callback, once, onerror){

	//check we have what we need
	if (!(subscriber && event && callback)){
		throw "You must set subscriber, event and callback parameters in the subscribe method";
	}

	//check that once is set or use default
	once = once || false;

	//check that onerror is set or use default
	onerror = onerror || null;

	//add a new subscriber array for this event if it doesn't already exist
	if (!this.events.hasOwnProperty(event)){
		this.events[event] = [];
	}

	//then add the new subscriber
	this.events[event].push( { subscriber: subscriber, callback : callback, once: once } );

};

/* Subscribe to an event only once */
EventHub.prototype.subscribeOnce = function(subscriber, event, callback, onerror){

	this.subscribe(subscriber, event, callback, true, onerror);
};

EventHub.prototype.unsubscribe = function(subscriber, event){

	var i,j;

	//check event exists
	if (this.events.hasOwnProperty(event)){

		//find subscriber and remove from array
		for (i = 0, j = this.events[event].length; i < j; i+=1){
			if (this.events[event][i].subscriber === subscriber){
				this.events[event].splice(i, 1);
			}
		}
	} else {
		throw "You are trying to unsubscribe from an event that doesn't exist";
	}
};

/* Fires event and passes any appropriate data */
EventHub.prototype.publish = function(event, data){

	var i, j;

	//return if this event has not been created
	if (!this.events.hasOwnProperty(event)){
		throw "You are trying to publish and event that doesn't exist";
	}

	var subscribers = this.events[event];

	var error = function(subscriber, e){

		return function(){
			subscriber.onerror.call(subscriber.subscriber, e);
		};
	}

	//fire callbacks on each subscriber - takes care of no subscribers as well
	for (i = 0, j = subscribers.length; i < j; i+=1){
		try {

			//run the callback in the original subscriber objects context
			//makes sure that the "this" of the callback is the subscriber
			subscribers[i].callback.call(subscribers[i].subscriber, data);

			//if this is a one time subscription then remove it
			if (subscribers[i].once){

				this.unsubscribe(subscribers[i].subscriber, event);
			}

		} catch(e) {
			//fire onerror callback in the case of an exception within the callback
			setTimeout(error(subscribers[i].subscriber, e), 0);
		}
	}

};
