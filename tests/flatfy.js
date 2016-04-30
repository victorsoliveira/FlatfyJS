/**
 * Created by victor.oliveira on 18/03/2016.
 */

var expect = require('expect.js');
var Flatfy = require('../src/flatfy')();

var stub = {};

beforeEach(function() {

    stub = {
        Foo: [
            {
                Bar: "value",
                Bar1: true,
                Bar2: 1
            }
        ]
    };

});

describe('instance', function() {

    it('should not be undefined', function () {
        expect(Flatfy).to.be.ok();
    });

});

describe('properties', function() {


    it('should list all properties', function () {
        Flatfy.parse(stub);

        var allProperties = Flatfy.listProperties();

        expect(allProperties[0].captionPath).to.be('Foo');
        expect(allProperties[0].valuePath).to.be('Foo');
        expect(allProperties[1].captionPath).to.be('Foo[0]');
        expect(allProperties[1].valuePath).to.be('Foo[0]');
        expect(allProperties[2].captionPath).to.be('Foo[0].Bar');
        expect(allProperties[2].valuePath).to.be('Foo[0].Bar');
        expect(allProperties[3].captionPath).to.be('Foo[0].Bar1');
        expect(allProperties[3].valuePath).to.be('Foo[0].Bar1');
        expect(allProperties[4].captionPath).to.be('Foo[0].Bar2');
        expect(allProperties[4].valuePath).to.be('Foo[0].Bar2');
    });

    it('should list only primitive properties', function () {
        Flatfy.parse(stub, true);

        var primitiveProperties = Flatfy.listProperties();

        expect(primitiveProperties[0].captionPath).to.be('Foo[0].Bar');
        expect(primitiveProperties[0].valuePath).to.be('Foo[0].Bar');
        expect(primitiveProperties[1].captionPath).to.be('Foo[0].Bar1');
        expect(primitiveProperties[1].valuePath).to.be('Foo[0].Bar1');
        expect(primitiveProperties[2].captionPath).to.be('Foo[0].Bar2');
        expect(primitiveProperties[2].valuePath).to.be('Foo[0].Bar2');
    });

    it('should resolve correctly property types', function () {
        Flatfy.parse(stub);

        var allProperties = Flatfy.listProperties();

        expect(allProperties[0].captionPath).to.be('Foo');
        expect(allProperties[0].valueType).to.be('array');
        expect(allProperties[1].captionPath).to.be('Foo[0]');
        expect(allProperties[1].valueType).to.be('object');
        expect(allProperties[2].captionPath).to.be('Foo[0].Bar');
        expect(allProperties[2].valueType).to.be('string');
        expect(allProperties[3].captionPath).to.be('Foo[0].Bar1');
        expect(allProperties[3].valueType).to.be('boolean');
        expect(allProperties[4].captionPath).to.be('Foo[0].Bar2');
        expect(allProperties[4].valueType).to.be('number');

    });

});

describe('values', function(){

    it('should set value correctly for primitive properties', function() {

        Flatfy.parse(stub, true);

        var primitiveProperties = Flatfy.listProperties();

        primitiveProperties[0].setValue('new value');
        expect(primitiveProperties[0].getValue()).to.be('new value');

    });

});

describe('array index decorator function', function(){

    it('should resolve captionPath and valuePath correctly', function() {

        Flatfy.parse(stub, true, function(parent, item){

            switch(parent){
                case "Foo":
                    return item.Bar;
            }

        });

        var primitiveProperties = Flatfy.listProperties();

        expect(primitiveProperties[0].captionPath).to.be('Foo.value.Bar');
        expect(primitiveProperties[0].valuePath).to.be('Foo[0].Bar');
    });

});