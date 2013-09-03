!function( root ) {
    var keys = Object.getOwnPropertyNames(Array.prototype),
        isObject = function( obj ) {
            return obj === Object(obj);
        },
        isValidProperty = function( obj, i ) {
            var value = obj[i],
                type = value.toString();

            return ( !isObject(value) && type != "[object Function]" && type != "[object RegExp]" );
        },
        subscriptionManager  = {
            subscribers: {
                any: []
            },
            subscribe: function ( action, fn, context ) {
                action = action || 'any';
                fn = typeof fn === "function" ? fn : context[fn];

                if (typeof this.subscribers[action] === "undefined") {
                    this.subscribers[action] = [];
                }
                this.subscribers[action].push({ fn: fn, context: context || this });
            },
            remove: function ( action, fn, context ) {
                this.processSubscribers('unsubscribe', action, fn, context);
            },
            notify: function ( action, publication ) {
                this.processSubscribers('publish', action, publication);
            },
            processSubscribers: function ( type, action, arg, context ) {
                var actionType = action || 'any',
                    subscribers = this.subscribers[actionType],
                    i,
                    subscribersLength = subscribers ? subscribers.length : 0;

                for ( i = 0; i < subscribersLength; i ++ ) {
                    if (type === 'publish') {
                        subscribers[i].fn.call(subscribers[i].context, arg);
                    } else {
                        if (subscribers[i].fn === arg && subscribers[i].context === context) {
                            subscribers.splice(i, 1);
                        }
                    }
                }
            }
        },
        makePublisher = function ( o ) {
            var i;

            for (i in subscriptionManager) {
                if (subscriptionManager.hasOwnProperty(i) && typeof subscriptionManager[i] === "function") {
                    o[i] = subscriptionManager[i];
                }
            }
            o.subscribers = { any: [] };
        },
        defineProperties = function( obj ) {
            obj.__properties = { };

            for(var i in obj) {
                if(!subscriptionManager[i] && obj.hasOwnProperty( i ) && isValidProperty( obj, i ) ) {
                    var oldValue = obj[i];
                   ! function( property ) {

                        Object.defineProperty( obj, property, {
                          get: function( ) {
                            return this.__properties[ property ];
                          },
                          set: function ( newValue ) {
                            if( this.__properties[ property ] !== newValue ) {
                                this.__properties[ property ] = newValue;
                                this.notify("change:" + property, newValue );
                            }
                          }
                        });
                        obj[property] = oldValue;
                    }( i );
                }
            }
        },
        observable = function( o ) {
            makePublisher( o );
            defineProperties( o );

            return o;
        };

var ObservableArray = function(arr) {
    this.underlying = arr;

    makePublisher(this);
};

ObservableArray.prototype.actionList = {
    join:       [ "change"],
    pop:        [ "remove", "change" ],
    slice:      [ "change" ],
    push:       [ "add", "change" ],
    concat:     [ "add", "change" ],
    shift:      [ "remove", "change" ],
    unshift:    [ "add", "change" ],
    reverse:    [ "change" ],
    sort:       [ "change" ]
};

keys.forEach( function( key ) {
    var action = ObservableArray.prototype.actionList[key];

    if(action) {
        ObservableArray.prototype[key] = function() {
            var self = this,
                args = arguments,
                underlyingArray = this.underlying,
                methodCallResult = Array.prototype[key].apply(underlyingArray, arguments),
                events = this.actionList[key];

            events.forEach( function(e) {
                self.notify(e, methodCallResult);
            });

            return methodCallResult;
        };
    } else {
        ObservableArray.prototype[key] = function() {
            var underlyingArray = this.underlying,
                methodCallResult = Array.prototype[action].apply(this.underlying, arguments);

            return methodCallResult;
        };
    }
});

var makeObservableArray = function ( arr ) {
    //loop through Array.prototype and wrap the one in actionList
    var result = new ObservableArray(arr);

    return result;
};

    var API = {
                publishable: makePublisher,
                observable: observable,
                observableArray: makeObservableArray
              };

        if(root.module && root.module.exports) {
            module.exports = API;
        } else {
            root.bindings = API;
        }

}( this );