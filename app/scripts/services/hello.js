angular.module('hausverwaltungAngularApp')
    .provider('helloWorld', function() {
        this.setName = function(name) { this.name = name; };

        this.$get = function() {
            var self = this;
            return {
                sayHello: function() { return "Hello, " + self.name + "!"; }
            }
        };
    });
