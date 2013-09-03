var binding = require("./xbinding"),
    should = require( "should" );

describe( "Given a the X Binding", function( ) {
    it( "should be defined", function( ) {
        binding.should.exists;
    } );
    it( "should have an observable method", function( ) {
        binding.observable.should.exists;
    } );
} );


/*
var person = { name: "Toto" };
var movie = { name: "Start Wars", author: "Lucas"  };

console.log("Part 1");
console.log("======");
console.log(person.name); //Toto
console.log(movie.author); //Lucas
console.log("======");

binding.observable(person);

person.subscribe("propertychange:name", function(value) {
    movie.author = value;
});

console.log("Part 2: Augmented");
console.log("======");
console.log(person.name); //Toto
console.log(movie.author); //Lucas
console.log("======");

person.name = "Test";

console.log("Part 3: Book and Person should be sync");
console.log("======");
console.log(person.name); // Test
console.log(movie.author); //Test

console.log("Part 4: Changing Book does not change person");
console.log("======");

movie.author = "Should not be changed";

console.log(person.name); //Test
console.log(movie.author); //Should not be changed

binding.observable(movie);

movie.subscribe("propertychange:author", function(value) {
    person.name = value;
});

movie.author = "tt"
console.log("Should be tt both")
console.log("=================")
console.log(movie.author);
console.log(person.name);*/