(function () {
    "use strict";
    var Toolbox = window.Toolbox = {};
    var ctor = function () {
    };
    var inherits = function (parent, protoProps, staticProps) {
        var child;
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }
        _.extend(child, parent);
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        if (protoProps)_.extend(child.prototype, protoProps);
        if (staticProps)_.extend(child, staticProps);
        child.prototype.constructor = child;
        child.__super__ = parent.prototype;
        return child;
    };

    function extendThis(protoProps, staticProps) {
        var child = inherits(this, protoProps, staticProps);
        child.extend = extendThis;
        return child;
    }

    Toolbox.Base = function () {
    };
    Toolbox.Base.extend = extendThis;
})();