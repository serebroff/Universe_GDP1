
//--------------------------------------------------
// Loading interface
//
//--------------------------------------------------

var loading;

Loading = function () {
     this.b_loaded = false;
};

Loading.prototype.Load = function () {



};

Loading.prototype.PrepareInterface = function () {

}

Loading.prototype.Calculate = function () {

};


Loading.prototype.Render = function () {
    
    var titleH =  0.45;


    // progress bar width and height
    var pw = 0.7, ph =  Math.floor(canvas.width / 14) / canvas.height ;
    
    // 
    var loadingY = canvas.height*(0.65-ph/2), loadingH = canvas.height* ph;
    
    var l =  texturehost.numloaded / (texturehost.num2load + texturehost.numloaded);
    
    ctx.fillStyle = "rgb(100,0,0)";
    ctx.fillRect(canvas.width*(1 -pw)/2,loadingY, canvas.width* pw, loadingH);
    
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.fillRect(canvas.width*(1 -pw)/2, loadingY, canvas.width* pw * l, loadingH);
    
    ctx.lineWidth = 5;
    ctx.strokeRect(canvas.width*(1 -pw)/2, loadingY, canvas.width* pw, loadingH);
    ctx.lineWidth = 1;
    
    var str;
    // Draw 'loading' text
    text.font.color = "white";
    text.font.strokecolor = "black";

    text.font.strokesize = 1;
    text.font.size = Math.floor(canvas.width / 18);
    if (this.b_loaded) {
        str = "tap me, click me";
        game.InitBeforeLevel();
        ChangeInterface(game);
    }
    else str = "loading...";

    text.render(str, canvas.width / 2 , loadingY + text.font.size);
    
    text.font.size = Math.floor(canvas.width / 8);
    str = "Революция";
    text.font.color = "rgb(255,0,0)";
    text.font.strokesize = 3;
    text.font.strokecolor = "rgb(20,0,0)";
    text.render(str, canvas.width / 2 , canvas.height *(1- 1.2*ph)/2 );

    text.resetFont();

    if (texturehost.num2load == 0 && texturehost.numloaded > 4)
    {
        this.b_loaded = true;
    }
};



//---------------------------------------------
// touch input

Loading.prototype.touchstart = function (e) {
    e.preventDefault();
    this.onmousedown(0, 0);
};

Loading.prototype.touchend = function (e) {
    e.preventDefault();
};

Loading.prototype.touchmove = function (e) {
    e.preventDefault();
};


//--------------------------------------------
// mouse input
//--------------------------------------------

Loading.prototype.onmousedown = function (x, y) {
    if (this.b_loaded)
    {
//        ChangeInterface(lobby);
    }
};

Loading.prototype.onmousemove = function (x, y) {
};

Loading.prototype.onmouseup = function (x, y) {

};


Loading.prototype.onrightmouseup = function (x, y) {
}

Loading.prototype.mousewheel = function (e) {
    e.preventDefault();
}

//---------------------------------------------
// keyboard input

Loading.prototype.onkeydown = function (e) {


}

Loading.prototype.onkeypress = function (e) {


}

Loading.prototype.onkeyup = function (e) {

}




