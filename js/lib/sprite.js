// ----------------------------------------
// sprite.js - very simple sprite class. 
// You can modify it for your needs
//-----------------------------------------


Sprite = function( config )
{
    this.initialize(config);
}

Sprite.prototype.initialize = function(config)
{

    this.frames = [];
    this.valid  = true;
    this.currentFrame = 0;
    this.timer = 0;
    this.fps = config.fps;
    this.size = config.size;

    var waiting = config.nframes;
    var that  = this;

    var imgname;
    //for (frame in config.frames)
    for (var i=0; i< config.nframes; i++)
    {
        imgname = (i+1).toString();
        if (imgname.length == 1) imgname = "00" + imgname;
        else if (imgname.length == 2) imgname = "0" + imgname;
        imgname = imgname +".png";

        this.frames.push(texturehost.Load(config.baseUrl + imgname));
/*        
        var img = new Image();
        this.frames.push(img);

        img.onload = function()
        {
            waiting--;

            if (waiting <=0)
                that.valid = true;
        }
        
        
        img.src = config.baseUrl + imgname;
        //img.src = config.baseUrl + "/" + config.frames[frame];
        */
    }
    
}


Sprite.prototype.update = function(dt)
{
    if (!this.valid) return;

    this.timer += dt;

    var frame = Math.floor( this.timer / (1000/this.fps) ) % this.frames.length;
    this.currentFrame=this.frames[frame];
}

Sprite.prototype.settime = function(time)
{
    if (!this.valid) return;

    this.timer = time;

    var frame = Math.floor( this.timer / (1000/this.fps) ) % this.frames.length;
    this.currentFrame=this.frames[frame];
}

Sprite.prototype.draw = function (x, y, w, h) {
    if (!this.valid) return;
    if (this.currentFrame.width == 0) return;

    if(arguments.length==2)   ctx.drawImage(this.currentFrame, x, y);
    else   ctx.drawImage(this.currentFrame, x, y, w, h);
}