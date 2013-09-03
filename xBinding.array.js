var binding = require("./xBinding");

var test = [ "test", "test2" ];

var obsArr = binding.observableArray(test);

obsArr.push("test5");

console.log(obsArr);

obsArr.subscribe("add", function(value){
    console.log(value);
});

obsArr.push("test6");

console.log(obsArr);

obsArr.reverse();

console.log(obsArr);