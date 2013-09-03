var binding = require("../xbinding"),
    should = require( "should" );

describe( "Given a the X Binding", function( ) {

    it( "should be defined", function( ) {
        binding.should.exists;
    } );

    it( "should have an observable method", function( ) {
        binding.observable.should.exists;
    } );

    describe( "when I Observe an object", function( ) {

        var Test = { name: "Toto" };

        it( "should have the name property", function( ) {
            binding.observable(Test);
            Test.name.should.exists;
        } );

        it( "should preserve how property works", function( ) {
            var value = "Test";

            Test.name = value;
            Test.name.should.equal(value);
        } );

        it( "should trigger an event", function( done ) {
            var value = "Test2";

            Test.subscribe("propertychange:name", function(value) {
                value.should.equal(value);
                done();
            });

            Test.name = value;
        } );
    } );
    describe( "when I want to bind 2 Objects, 1st One will be observed", function( ) {

        var person = { name: "Toto" },
            movie = { name: "Start Wars", author: "Lucas"  },
            testValue = "1";

        binding.observable(person);

        person.subscribe("propertychange:name", function(value) {
            movie.author = value;
        });

        it( "shoud update the 2nd Ojbect", function(  ) {
            person.name = testValue;
            person.name.should.equal(testValue);
            movie.author.should.equal(testValue);
        } );

        describe( "and now both are observed", function( ) {

            binding.observable(movie);

            movie.subscribe("propertychange:author", function(value) {
                person.name = value;
            });

            it( "both object should be sync", function(  ) {

                movie.author = 2;
                movie.author.should.equal(2);
                person.name.should.equal(2);
            } );
        } );
    } );
} );