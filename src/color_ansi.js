var cache = {};

// thanks to https://github.com/TooTallNate/ansi.js for this math
// maps rgb values from 0-255 to one of the 216 colors in ansi palette
var rgb_to_ansi_216 = function(r, g, b){
  return 16 +
         (Math.round(r / 255 * 5) * 36) +
         (Math.round(g / 255 * 5) * 6) +
         Math.round(b / 255 * 5)
}

var build_cache = function(palette_name){
  var palette_css = require('./palette/' + palette_name);
  var palette = cache[palette_name] = [];
  
  for (var i = 0; i < palette_css.length; i++){
    
    var rgbs = palette_css[i]
               .replace('rgb(', '')
               .replace(')', '')
               .split(',')
    ;
    
    palette.push('5;' + rgb_to_ansi_216(
      Number(rgbs[0]), Number(rgbs[1]), Number(rgbs[2])))
    ;

    }
}

var color_ansi_map = function(color_index, palette_name){
  if (!(palette_name in cache))
    build_cache(palette_name);
  return cache[palette_name][color_index];
};


module.exports = color_ansi_map;
