//-----------------------------------------------------
//  Base class for pop ups, flying info from picked resourses
//  and so on
//  
//-----------------------------------------------------


PopupInfo = function () {
    // constants
    this.INFO_FLIGHT_TIME = 1000;
    this.TITLE_FLIGHT_TIME = 1000;
};


PopupInfo.prototype.InitBeforeLevel = function () {
    this.ar_flyinginfo = [];
    this.ar_popups = [];
    this.ar_title = [];
};

PopupInfo.prototype.Load = function () {

};


PopupInfo.prototype.AddFlyingInfoXY = function (string, x,y) {
    this.AddFlyingInfo(string, new Vec2(x,y));
}

PopupInfo.prototype.AddFlyingInfo = function (string, pos) {
    this.ar_flyinginfo.push({
        "string": string,
        "pos": new Vec2(pos.x, pos.y),
        "time": 0,
    });
}

PopupInfo.prototype.AddTitle = function (string) {
    this.ar_title.push({
        "string": string,
        "time": 0,
    });
}



PopupInfo.prototype.Calculate = function () {
    var i;
    for (i = 0; i < this.ar_flyinginfo.length; i++) {
        this.ar_flyinginfo[i].time += tickperframe;

        if (this.ar_flyinginfo[i].time > this.INFO_FLIGHT_TIME) {
            // delete item if time is over
            this.ar_flyinginfo.splice(i, 1);
        }
    }
    
    for (i = 0; i < this.ar_title.length; i++) {
        this.ar_title[i].time += tickperframe;

        if (this.ar_title[i].time > this.TITLE_FLIGHT_TIME) {
            // delete item if time is over
            this.ar_title.splice(i, 1);
        }
    }
};


PopupInfo.prototype.Render = function () {
    var i, a;
    
    // flying info
    text.font.b_stroke = false;
    text.font.size = 25;

    for (i = 0; i < this.ar_flyinginfo.length; i++) {
        a = 1 - this.ar_flyinginfo[i].time / this.INFO_FLIGHT_TIME;
        a = Math.sqrt(a);
        ctx.globalAlpha = a;
        text.render(this.ar_flyinginfo[i].string, this.ar_flyinginfo[i].pos.x, this.ar_flyinginfo[i].pos.y - CELL_SIZE * (1- a));
    }
    text.resetFont();
}

PopupInfo.prototype.RenderOverScreen = function ()
{
    var i, a, k;
    
    var fontsize = Math.floor(canvas.width / 24);
    // titles
    for (i = 0; i < this.ar_title.length; i++) {
        k = 1 - this.ar_title[i].time / this.INFO_FLIGHT_TIME;
        a = 2*Math.sin(Math.PI * k);
        if (a>1) a=1;
        ctx.globalAlpha = a;
        
        text.font.size = Math.floor(fontsize *a +fontsize);
        text.render(this.ar_title[i].string, canvas.width/2, canvas.height/2);

    }
    ctx.globalAlpha = 1;
    
    text.resetFont();
};

