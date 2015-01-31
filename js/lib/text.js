/* 
 * 
 *  Base class for work with text
 * 
 */


var text = {
    fontdefault: {// default
        name: 'sans-serif',
        size: 24,
        align: "center",
        b_stroke: true,
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
    renderWrapped: function(text, x, y, maxWidth, lineHeight) {

        var fontname = '';
        ctx.save();
        ctx.fillStyle = this.font.color;
        ctx.textAlign = this.font.align;
        if (this.font.b_bold)
            fontname = "bold ";
        fontname += this.font.size + "px " + this.font.name;
        ctx.font = fontname;

        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
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
        fontname += this.font.size + "px " + this.font.name;
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