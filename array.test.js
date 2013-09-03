var binding = require("./xBinding");

var test = [ "test", "test2" ];

var keys = Object.getOwnPropertyNames(Array.prototype);

var ObservableArray = function(arr) {
    this.underlying = arr;

    binding.publishable(this);
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
        }
    } else {
        ObservableArray.prototype[key] = function() {
            var underlyingArray = this.underlying,
                methodCallResult = Array.prototype[action].apply(this.underlying, arguments);

            return methodCallResult;
        }
    }
});


var makeObservableArray = function ( arr ) {
    //loop through Array.prototype and wrap the one in actionList
    var result = new ObservableArray(arr);

    return result;
};

var obsArr = makeObservableArray(test);

obsArr.push("test5");

console.log(obsArr);

obsArr.subscribe("add", function(value){
    console.log(value);
});

obsArr.push("test6");

console.log(obsArr);

obsArr.reverse();

console.log(obsArr);