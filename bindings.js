var xBinding = require("xBinding");

var parseBindings: function() {
        return this.bindings || { };
    },
    createBindingConfiguration: function() {
        var component = this,
            bindings = this.parseBindings(),
            result = [];

        //try {
           //var json = JSON.parse(conf);

           Object.keys(bindings).forEach(function(key) {
                var bindingConfiguration = { from: [], to: key, converter: undefined, component: component },
                    config = json[key],
                    modelPath,
                    component,
                    attribute;

                if(!_.isObject(config)) {
                    component = this.module[config.split(".")[0]];
                    attribute = config.split(".")[1];

                    bindingConfiguration.from.push({ component: component, attribute: attribute });
                } else {
                    bindingConfiguration.converter = getConverter(config.converter);

                    _.each(config.parameters, function(value) {
                        component =  getUniformModel(app, value.split(".")[0]);

                        attribute = getUniformAttribute(component, value.split(".")[1]);

                        bindingConfiguration.from.push({ component:component, attribute: attribute });
                      });
                }

                result.push(bindingConfiguration);
           });
        /*}
        catch (ex) {
          //alert("Failed to data-bind: " + scId + "." + left + " => " + right + "\n" + ex);
          throw "Failed to data-bind";
        }*/
        this.__bindingsConf = result;
        return result;
    },
    createBinding: function() {
        var b = this.createBindingConfiguration();

        if(b.length > 0) {
            b.from.forEach(function(f) {
                b.component[b.to] = getValue(b);

                f.component.subscribe("propertychange:" + f.attribute, function (newValue) {
                    b.component[b.to] = getValue(b);
                });
            });
        }
    },
    getValue = function(binding) {
        if(binding.converter) {
        var parameters = [];

        _.each(binding.from, function (setup) {
            parameters.push(setup.model[setup.attribute]);
        });

        return binding.converter(parameters);
      } else {
        var singleModel = binding.from[0].model,
            attr = binding.from[0].attribute;

        return singleModel[value];
      }
    },
    getConverter = function(converterName) {
        var converter = FRAMEWORK.Converters[converterName];
        if(!converter) {
            return undefined;
        } else {
            return converter;
        }
    };

FRAMEWORK = {
    Converters: []
};

/**
 * [
 *   { "name":     "External.name" },
 *   { "lastname": { parameters: "[ External.lastname ], converter: "has" } }
 * ]
 */
module.exports = {
    name: "Bindings",
    exports: xBinding,
    execute: function(component) {
        return binding.observable(component);
    },
    priority: 1000
};