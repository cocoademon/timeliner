// ********** class: Color ****************** //
/*
    A basic RGB (no alpha) color class, which supports
    conversion to/from HSL and HTML-style Hex strings.
*/
// ***********************************************

function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}


Color.prototype.toHexString = function() {
    return Color.rgbToHexString(this.r, this.g, this.b);
}

Color.prototype.toHSL = function() {
    var r = this.r / 255.0;
    var g = this.g / 255.0;
    var b = this.b / 255.0;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var chroma = max - min;

    var hue = 0;
    if(chroma < 0.001) { hue = 0; }
    else if (max === r) { hue = ((g - b) / chroma) % 6; }
    else if (max === g) { hue = ((b - r) / chroma) + 2; }
    else if (max === b) { hue = ((r - g) / chroma) + 4; }
    hue *= 60; // convert to degrees

    return {
        h: hue,
        s: chroma / max,
        l: 0.5 * (max + min)
    }
}

Color.prototype.fromHSL = function(h, s, l) {
    var r = 0, g = 0, b = 0;
    var hdash = h / 60;
    var chroma = (1.0 - Math.abs(2 * l  - 1)) * s;
    var x = chroma * (1 - Math.abs(hdash % 2 - 1));
    if(hdash < 1) { r = chroma; g = x; }
    else if(hdash < 2) { r = x; g = chroma; }
    else if(hdash < 3) { g = chroma; b = x; }
    else if(hdash < 4) { g = x; b = chroma; }
    else if(hdash < 5) { r = x; b = chroma; }
    else if(hdash < 6) { r = chroma; b = x; }
    else { console.log('out of range'); }
    var min = l - (0.5 * chroma);
    this.r = (r + min) * 255;
    this.g = (g + min) * 255;
    this.b = (b + min) * 255;
    return this;
}

Color.prototype.fromHexString = function(hexString) {
    var color = parseInt(hexString.substring(1,7), 16);
    this.r = ((color / 65536) & 0xff);
    this.g = ((color / 256) & 0xff);
    this.b = (color & 0xff);
    return this;
}

Color.fromHexString = function(hexString) {
    return new Color().fromHexString(hexString);
};

Color.fromHSL = function(h, s, l) {
    return new Color().fromHSL(h, s, l);
}

Color.rgbToHexString = function(r, g, b) {
    var clampR = Math.max(Math.min(r, 255), 0) & 0xff;
    var clampG = Math.max(Math.min(g, 255), 0) & 0xff;
    var clampB = Math.max(Math.min(b, 255), 0) & 0xff;

    var color = (clampR * 65536 + clampG * 256 + clampB) | 0;
    return '#' + ('000000' + color.toString(16)).slice(-6);
}


Color.standout = function(hexString) {
    var color = Color.fromHexString(hexString);
    var hsl = color.toHSL();

    if(hsl.l > 0.5) {
        hsl.l = 0.3;
    } else {
        hsl.l = 0.8;
    }

    return Color.fromHSL(hsl.h, hsl.s, hsl.l).toHexString();
}

var _hue = 0;
var _hueIncrement = 137; // coprime to 360

Color.random = function() {
    _hue = (_hue + _hueIncrement) % 360;

    return Color.fromHSL(
            _hue,
            Math.random() * 0.2 + 0.3,
            Math.random() * 0.2 + 0.5
        ).toHexString();
}

module.exports = Color;
