
// Uses Node, AMD or browser globals to create a module. This example creates
// a global even when AMD is used. This is useful if you have some scripts
// that are loaded by an AMD loader, but they still want access to globals.
// If you do not need to export a global for the AMD case,
// see returnExports.js.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrictGlobal.js

// Defines a module "returnExportsGlobal" that depends another module called
// "b". Note that the name of the module is implied by the file name. It is
// best if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['lodash'], function (_) {
            return (root.Flatfy = factory(_));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        var lodash = global.lodash || require('lodash');
        module.exports = factory(lodash);
    } else {
        // Browser globals
        var lodash = root.lodash || root._;
        root.Flatfy = factory(lodash);
    }
}(this, function (_) {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return function() {

        var properties;

        return {
            parse: function(obj, onlyPrimitiveProperties, arrayIndexDecoratorFn){
                properties = resolveProperties(null, null, obj, onlyPrimitiveProperties, arrayIndexDecoratorFn);
            },
            listProperties: function(){
              return properties;
            }
        };

        function resolveProperties(parentName, parentValue, from, onlyPrimitiveProperties, arrayIndexDecoratorFn) {

            var collection = new PropertyCollection(onlyPrimitiveProperties);

            if(from){

                if (typeof from === 'object'){

                    if (Array.isArray(from)) {

                        for(var aI = 0; aI < from.length; aI++) {

                            var item = from[aI];

                            if (item) {

                                var defaultValue =  '[' + aI.toString() + ']';
                                var name = defaultValue;

                                if (arrayIndexDecoratorFn){
                                    name = arrayIndexDecoratorFn(parentName, item);
                                    if(!name || name === ''){
                                        name = defaultValue;
                                    }
                                }

                                var property = collection.addNewProperty(from, parentName, parentValue, name, defaultValue);

                                if (typeof item === 'object') {

                                    var properties = resolveProperties(property.captionPath, property.valuePath, item, onlyPrimitiveProperties, arrayIndexDecoratorFn);

                                    for (var aJ = 0; aJ < properties.length; aJ++){
                                        var aP = properties[aJ];
                                        collection.addProperty(aP);
                                    }
                                }
                            }

                        }

                    } else {

                        var ownProperties = Object.getOwnPropertyNames(from);
                        for (var oI = 0; oI < ownProperties.length; oI++) {

                            var name = ownProperties[oI];
                            var property = collection.addNewProperty(from, parentName, parentValue, name, name);

                            if (property.getValue() && (property.valueType === 'object' || property.valueType === 'array')) {

                                var properties = resolveProperties(property.captionPath, property.valuePath, property.getValue(), onlyPrimitiveProperties, arrayIndexDecoratorFn);

                                for (var oJ = 0; oJ < properties.length; oJ++){
                                    var oP = properties[oJ];
                                    collection.addProperty(oP);
                                }

                            }

                        }

                    }

                }

            }

            return collection.properties;

        }

        function PropertyCollection(onlyPrimitiveProperties) {

            this.properties = [];

            this.addNewProperty = function (parent, parentName, parentValue, name, value) {
                var p = new Property(parent, parentName, parentValue, name, value);
                this.addProperty(p);
                return p;
            };

            this.addProperty=function(p) {
                if (onlyPrimitiveProperties){
                    if (p.getValue() && (p.valueType !== 'object' && p.valueType !== 'array')){
                        this.properties.push(p);
                    }
                } else {
                    this.properties.push(p);
                }
            };
        }

        function Property(declaringObject, parentName, parentValue, propertyName, propertyValue) {

            var createPropertyPath = function (parent, value) {
                if (parent) {
                    if (isArrayIndexValue(value)){
                        return parent + '' + value;
                    }
                    return parent + '.' + value;
                }
                return value;
            };

            var findPropertyType  = function(property) {
                var value = property.getValue();
                if (value === null) {
                    return "string";
                }
                if (Array.isArray(value)){
                    return "array";
                }
                return (typeof value);
            };

            var getParentName = function () {
                if (parentName) {
                    var parts = parentName.split('.');
                    return parts[parts.length - 1];
                }
                return parentName;
            };

            var getSafeValue = function(value) {
                if (isArrayIndexValue(value)){
                    return value.substring(1,2);
                }
                return value;
            };

            var isArrayIndexValue = function(value) {
                return value.substring(0,1) === '[' && isNumber(value.substring(1,2)) && value.substring(2,3) === ']';
            };

            var isNumber = function (value) {
                return !isNaN(String(value) * 1);
            };

            this.getValue = function () {
                return this.declaringObject[this.value];
            };

            this.setValue = function (value) {
                this.declaringObject[this.value] = value;
            };

            this.isJSON = function (value) {
                var isJson = false;
                try {
                    var o = JSON.parse(value);
                    if (o && typeof o === "object" && o !== null)
                        isJson = true;
                } catch (err) {
                }
                return isJson;
            };

            this.declaringObject = declaringObject;
            this.name = getSafeValue(propertyName);
            this.value = getSafeValue(propertyValue);
            this.parentFullName = getParentName();
            this.captionPath = createPropertyPath(parentName, propertyName);
            this.valuePath = createPropertyPath(parentValue, propertyValue);
            this.valueType = findPropertyType(this);
        }

    }

}));