/**
 * Created by victor.oliveira on 18/03/2016.
 */

var expect = require('expect.js');
var Flatfy = require('../src/flatfy')();

describe('Instance', function() {

    it('should not be undefined', function () {
        expect(Flatfy).to.be.ok();
    });

});

describe('ArrayIndexDecoratorFunction', function(){

    it('should resolve path and pathValue correctly', function() {

        var stub = {
            Foo: [
                { Bar: "Bar 1"},
                { Bar: "Bar 2"},
                { Bar: "Bar 3"}
            ]
        };

        Flatfy.parse(stub, true, function(parent, item){

            switch(parent){
                case "Foo":
                    return item.Bar;
            }

        });

        var properties = Flatfy.getProperties();

        expect(properties[0].path).to.be('Foo.Bar 1.Bar');
        expect(properties[0].pathValue).to.be('Foo[0].Bar');
        expect(properties[1].path).to.be('Foo.Bar 2.Bar');
        expect(properties[1].pathValue).to.be('Foo[1].Bar');
        expect(properties[2].path).to.be('Foo.Bar 3.Bar');
        expect(properties[2].pathValue).to.be('Foo[2].Bar');
    });

});