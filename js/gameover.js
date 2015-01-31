//-------------------------------------------------------
// Base class for the game object
//-------------------------------------------------------

var gameover;

GameOver = function () {
    this.b_win = false;
    this.b_opponentLeft = false;
};

GameOver.prototype.Load = function () {

};

GameOver.prototype.PrepareInterface = function () {
    multiplayer.b_InGame = false;
}

GameOver.prototype.Calculate = function () {

};


GameOver.prototype.Render = function () {

    var str;
    // Draw FPS
    text.font.color = "red";
    text.font.strokecolor = "black";

    text.font.size =80;
    if (this.b_win) str = "Революция победила!";
    else str = "Революция проиграна";
    text.render(str, canvas.width / 2, canvas.height / 2);
    

    text.resetFont();

};



//---------------------------------------------
// touch input

GameOver.prototype.touchstart = function (e) {
    e.preventDefault();
    this.onmousedown(0, 0);
};

GameOver.prototype.touchend = function (e) {
    e.preventDefault();
};

GameOver.prototype.touchmove = function (e) {
    e.preventDefault();
};


//--------------------------------------------
// mouse input
//--------------------------------------------

GameOver.prototype.onmousedown = function (x, y) {
   // ChangeInterface(lobby);
};

GameOver.prototype.onmousemove = function (x, y) {
};

GameOver.prototype.onmouseup = function (x, y) {

};


GameOver.prototype.onrightmouseup = function (x, y) {
}

GameOver.prototype.mousewheel = function (e) {
    e.preventDefault();
}

//---------------------------------------------
// keyboard input

GameOver.prototype.onkeydown = function (e) {


}

GameOver.prototype.onkeypress = function (e) {


}

GameOver.prototype.onkeyup = function (e) {

}




