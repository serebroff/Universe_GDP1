/* 
* 
*  Base class for work with text
* 
*/

var devlog = {
    ar_strings: [],
    b_on: false,
    add: function(str)
    {
        this.ar_strings.push(str);
    },
    onoff: function()
    {
        this.b_on = !this.b_on;
    },
    render: function()
    {
        if (!this.b_on) return;
        ctx.save();
        ctx.fillStyle = "rgb(255,100,0)";
        ctx.textAlign = "left";
        ctx.font = "15px sans-serif";

        for (var i in this.ar_strings)
        {
            ctx.fillText(this.ar_strings[this.ar_strings.length - i -1], 20, canvas.height - 20 - i*40);
        }
        
        ctx.restore();
    }

};