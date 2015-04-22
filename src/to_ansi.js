var to_json = require('./to_json')
var color_ansi_map = require('./color_ansi')

var style = {
  fg: 0,
  bg: 1,
  palette: 'mirc'
};

var char_escape = '\x1b[';
var char_reset = char_escape + '0m';

var colorcode_to_ansi = function(string_or_json, opts){
  opts = opts || {};
  
  var palette_name = opts.palette || style.palette;
  opts.fg = "fg" in opts ? opts.fg : style.fg;
  opts.bg = "bg" in opts ? opts.bg : style.bg;

  var json = to_json(string_or_json, opts);

  var out = "";

  for (var l = 0, line; line = json.lines[l]; l++){
    if (l > 0) out += '\n';
    for (var c = 0, char; char = line[c]; c++){
      out += char_escape;
      out += '38;' + color_ansi_map(char.fg, palette_name);
      out += ';'
      out += '48;' + color_ansi_map(char.bg, palette_name);
      out += 'm'
      out += String.fromCharCode(char.value);
    }
    out += char_reset;
  }

  return out;

}

module.exports = colorcode_to_ansi;
