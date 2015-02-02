/* 
 * 
 *  Base class for work with text
 * 
 */
GAME_SCALE=1;

var text = {
    fontdefault: {// default
        name: 'sans-serif',
        size: 24,
        align: "center",
        b_stroke: false,
        b_bold: true,
        color: "RGB(255,0,0)",
        strokecolor: "RGB(0,0,0)",
        strokesize: 1,
    },
    font: {},
    Load: function()
    {
        this.resetFont();
    },
    resetFont: function()
    {
        for (var attr in this.fontdefault) {
            this.font[attr] = this.fontdefault[attr];
        }
        //this.font = this.fontdefault;
    },
    setFontInCTX: function() {
        var fontname = '';
        ctx.textAlign = this.font.align;
        if (this.font.b_bold)     fontname = "bold ";
        var fs = Math.floor(GAME_SCALE* this.font.size); 
        fontname += fs + "px " + this.font.name;
        ctx.font = fontname;
    },
    getWrappedHeight: function(text, maxWidth, lineHeight) {

        lineHeight*=GAME_SCALE;
        var fontname = '';
        ctx.save();
        ctx.textAlign = this.font.align;
        if (this.font.b_bold)
            fontname = "bold ";
        var fs = Math.floor(GAME_SCALE* this.font.size); 
        fontname += fs + "px " + this.font.name;
        ctx.font = fontname;
        var y=0;
        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        y += lineHeight;
        
        ctx.restore();
        return y;
    },

    renderWrapped: function(text, x, y, maxWidth, lineHeight) {
        lineHeight*=GAME_SCALE;
        
        var fontname = '';
        ctx.save();
        ctx.fillStyle = this.font.color;
        ctx.textAlign = this.font.align;
        if (this.font.b_bold)
            fontname = "bold ";
        var fs = Math.floor(GAME_SCALE* this.font.size); 
        fontname += fs + "px " + this.font.name;
        ctx.font = fontname;
        if (this.font.b_stroke)
        {
            ctx.lineWidth = this.font.strokesize;
            ctx.strokeStyle = this.font.strokecolor;
        }

        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                if (this.font.b_stroke)
                {
                    ctx.strokeText(line, x, y);
                }
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
        if (this.font.b_stroke)
        {
            ctx.strokeText(line, x, y);
        }
        ctx.restore();
    },
    render: function(string, x, y)
    {
        var fontname = '';
        ctx.save();
        ctx.fillStyle = this.font.color;
        ctx.textAlign = this.font.align;
        if (this.font.b_bold)
            fontname = "bold ";
        var fs = Math.floor(GAME_SCALE* this.font.size); 
        fontname += fs + "px " + this.font.name;
        ctx.font = fontname;
        ctx.fillText(string, x, y);
        if (this.font.b_stroke)
        {
            ctx.lineWidth = this.font.strokesize;
            ctx.strokeStyle = this.font.strokecolor;
            ctx.strokeText(string, x, y);
        }
        ctx.restore();
    }

};