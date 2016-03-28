/**
 * Created by victor.oliveira on 18/03/2016.
 */

var expect = require('expect.js');
var Flatfy = require('../src/flatfy')();

var stub = {
    Foo: [
        { Bar: "Bar 1"}
    ]
};

describe('instance', function() {

    it('should not be undefined', function () {
        expect(Flatfy).to.be.ok();
    });

});

describe('list properties', function() {


    it('should list all properties', function () {
        Flatfy.parse(stub);

        var allProperties = Flatfy.listProperties();

        expect(allProperties[0].captionPath).to.be('Foo');
        expect(allProperties[0].valuePath).to.be('Foo');
        expect(allProperties[1].captionPath).to.be('Foo[0]');
        expect(allProperties[1].valuePath).to.be('Foo[0]');
        expect(allProperties[2].captionPath).to.be('Foo[0].Bar');
        expect(allProperties[2].valuePath).to.be('Foo[0].Bar');
    });

    it('should list only primitive properties', function () {
        Flatfy.parse(stub, true);

        var primitiveProperties = Flatfy.listProperties();

        expect(primitiveProperties[0].captionPath).to.be('Foo[0].Bar');
        expect(primitiveProperties[0].valuePath).to.be('Foo[0].Bar');
    });

    it('should resolve correctly property types', function () {
        Flatfy.parse(stub);

        var allProperties = Flatfy.listProperties();


    });

});

describe('Array index decorator function', function(){

    it('should resolve captionPath and valuePath correctly', function() {

        Flatfy.parse(stub, true, function(parent, item){

            switch(parent){
                case "Foo":
                    return item.Bar;
            }

        });

        var primitiveProperties = Flatfy.listProperties();

        expect(primitiveProperties[0].captionPath).to.be('Foo.Bar 1.Bar');
        expect(primitiveProperties[0].valuePath).to.be('Foo[0].Bar');
    });

});