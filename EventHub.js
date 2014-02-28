
(function (root){

	this.pubsub = {

		events: {},

		subscribe: function(subscriber, event, callback, context, once){

			once = once || false;

			//add a new subscriber array for this event if it doesn't already exist
			if (!this.events.hasOwnProperty(event)){
				this.events[event] = [];
			}

			//then add the new subscriber if the callback is a function
			if (typeof callback != "function"){
				this.events[event].push( { subscriber: subscriber, callback : callback, context: callContext, once : once } );
			} else {
				throw "Trying to add a callback that isn't a function"
			}
		},
		unsubscribe: function(subscriber, event){

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
				throw "Trying to unsubscribe from an event that doesn't exist";
			}
		},
		publish: function(event, data){

			var i, j;

			//return if this event has not been created
			if (!this.events.hasOwnProperty(event)){
				throw "Trying to publish an event that doesn't exist";
			}

			var subscribers = this.events[event];

			//fire callbacks on each subscriber - takes care of no subscribers as well
			for (i = 0, j = subscribers.length; i < j; i+=1){

				subscribers[i].callback.call(subscribers[i].context, data);

				if (subscribers[i].once){
					this.unsubscribe(subscribers[i].subscriber, event);
				}
			}

		}
	}

	 if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = pubsub;
		}
		exports.pubsub = pubsub;
	} else if (typeof define === 'function' && define.amd) {
		define('pubsub', function() {
			return pubsub;
		});
	} else {
		root.pubsub = pubsub;
	}
})(this);