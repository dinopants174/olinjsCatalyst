var Util = require('./util');

var exports = module.exports = {};

exports.classic = {
    distance: function (width, sides) {
        return Math.round(width * Math.log(sides))
    },
    figures: function (width, all_info, initial) {
        var sides = all_info.length;
        var angle = 2 * Math.PI / sides;
        var distance = exports.classic.distance(width, sides);
        var acceptable = Math.round(initial / angle) * angle;
        return Util.range(0, sides).map(function (d) {
            var angleR = d * angle + acceptable;
            return {
                rotateY: 0,
                translateX: distance * Math.sin(angleR),
                translateZ: distance * Math.cos(angleR),
                opacity: 1,
                present: true,
                key: d,
                all_info: all_info[d]
            };
        });
    }
};

