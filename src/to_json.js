var char_color = '\x03';
var regexp_color = /(^[\d]{1,2})?(?:,([\d]{1,2}))?/;

var style_chars = {
  '\x02': 'bold',
  '\x1d': 'italic',
  '\x1f': 'underline',
  '\x0f': 'reset',
  '\x16': 'inverse'
};

var Style = function(style){
  this.b = style.b;
  this.i = style.i;
  this.u = style.u;
  this.fg = style.fg;
  this.bg = style.bg;
};

var style_fns = {};

style_fns.bold = function(style){ style.b = !style.b };

style_fns.italic = function(style){ style.i = !style.i };

style_fns.underline = function(style){ style.u = !style.u };

style_fns.inverse = function(style){
  var tmp = style.fg;
  style.fg = style.bg;
  style.bg = tmp;
};

style_fns.reset = function(style, base_style){
  style.b =  base_style.b;
  style.i =  base_style.i;
  style.u =  base_style.u;
  style.fg = base_style.fg;
  style.bg = base_style.bg;
};

var colorcode_to_json = function(string, opts){
  // looks like its already converted
  if (typeof string === 'object' &&
      'lines' in string &&
      'w' in string &&
      'h' in string)
    return string;
 

  opts = opts || {};
  var d = colorcode_to_json.defaults;

  var base_style = {
    b:  "b" in opts ? opts.b : d.b,
    i:  "i" in opts ? opts.i : d.i,
    u:  "u" in opts ? opts.u : d.u,
    fg: "fg" in opts ? opts.fg : d.fg,
    bg: "bg" in opts ? opts.bg : d.bg
  };

  var lines_in = string.split(/\r?\n/);
  var lines_out = [];
  var w = 0, h = 0;

  for (var i=0; i<lines_in.length; i++){
    var line = lines_in[i];
    if (line.length === 0) continue; // skip blank lines
    var json_line = line_to_json(line, base_style);
    if (w < json_line.length) w = json_line.length;
    lines_out.push(json_line);
    h++;
  }

  return {w:w, h:h, lines:lines_out};
};

colorcode_to_json.defaults = {
  b: false
, i: false
, u: false
, fg: 1
, bg: 99
};

var line_to_json = function(line, base_style){
  var out = [];
  var pos = -1;
  var len = line.length -1;
  var char;
  var style = new Style(base_style); 
  
  while (pos < len){ pos++;

    char = line[pos];
    
    // next char is a styling char
    if (char in style_chars){
      style_fns[style_chars[char]](style, base_style);
      continue;
    }

    // next char is a color styling char, with possible color nums after
    if (char === char_color){
      var matches = line.substr(pos+1,5).match(regexp_color);
      
      // \x03 without color code is a soft style reset 
      if (matches[1] === undefined && matches[2] === undefined) {
        style.fg = base_style.fg;
        style.bg = base_style.bg;
        continue;
      }

      if (matches[1] !== undefined)
        style.fg = Number(matches[1]);

      if (matches[2] !== undefined)
        style.bg = Number(matches[2]);

      pos += matches[0].length;
      continue;
       
    }

    // otherwise, next char is treated as normal content
    var data = new Style(style);
    //data.value = char;
    data.value = char.charCodeAt(0);

    out.push(data);
  }
  return out;
};

module.exports = colorcode_to_json;
