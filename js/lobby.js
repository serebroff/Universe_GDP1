
//--------------------------------------------------
// Multiplayer lobby interface
//
//--------------------------------------------------

var lobby;

Lobby = function () {
    this.rectPvPbutton= {x:0,y:0,x1:0,y1:0};
    this.rectAIbutton= {x:0,y:0,x1:0,y1:0};
};

Lobby.prototype.Load = function () {
    multiplayer = new Multiplayer;
    multiplayer.Load();
};

Lobby.prototype.PrepareInterface = function () {
    devlog.add("Init Lobby");
    multiplayer.EnterLobby();
    
};


Lobby.prototype.StartGameAsHost = function()
{
    game.b_PvP = true;
    game.b_PlayerReceiver = false;
    game.InitBeforeLevel();
    
    multiplayer.SendEvent(0, game.level_random_seed);
    
    devlog.add("StartGameAsHost, seed has been sent");
    
    ChangeInterface(game);
}

Lobby.prototype.StartGameAsReceiver = function(content)
{
    devlog.add("StartGameAsReceiver, seed recived ");

    game.b_PvP = true;
    game.b_PlayerReceiver = true;
    game.level_random_seed = content;
    
    game.InitBeforeLevel();
    
    game.b_myTurn = false;
    //game.mobs.PrepareNextTurn();
    
    ChangeInterface(game);
}

Lobby.prototype.StartGameVsAI = function()
{
    devlog.add("StartGameVsAI");
    game.b_PvP = false;
    game.b_PlayerReceiver = false;

    game.InitBeforeLevel();
    
    ChangeInterface(game);
}


Lobby.prototype.Calculate = function () {

};


Lobby.prototype.Render = function () {
    
    // progress bar width and height
    var pw = 0.5, ph = 0.3 ;
    
   
    // Lobby name
    text.font.size = Math.max(Math.floor(canvas.height / 13),Math.floor(canvas.width / 10));
    var str = "Революция";
    text.font.color = "rgb(255,0,0)";
    text.font.strokesize = 3;
    text.font.strokecolor = "rgb(20,0,0)";
    text.render(str, canvas.width / 2 , canvas.height *ph );
    
    
    // Draw 'lobby' text
    text.font.color = "white";
    text.font.strokecolor = "black";

    text.font.strokesize = 1;
    text.font.size =Math.max(Math.floor(canvas.height / 33),Math.floor(canvas.width / 30));

    ph+=0.16;
    str = "Players Online: " + multiplayer.numPlayersOnline;
    text.render(str, canvas.width / 2 , canvas.height *ph);

    ph+=0.1;
    str = "Players in the lobby: " + multiplayer.numPlayersReadyToPlay;
    text.render(str, canvas.width / 2 , canvas.height *ph);

    ph+=0.1;
    
    // Play with player button
    ctx.fillStyle = "rgb(200,200,0)";
    
    if (multiplayer.b_startPvP) {
        str = "Connecting...";        
    }        
    else if (multiplayer.b_waitingOpponent) {
        str = "Wait for opponent...";
    }
    else if (multiplayer.b_connectingOpponent) {
        str = "Get into game...";
    }
    else {
        str = "Continue revolution";
        ctx.fillStyle = "rgb(100,255,0)";
    }
    
    ctx.strokeStyle = "rgb(0,0,0)";
    
    this.rectPvPbutton = { x: canvas.width*(1 -pw)/2, y: canvas.height *ph, x1:canvas.width* pw, y1: canvas.height *0.1};   
    ctx.fillRect(this.rectPvPbutton.x,this.rectPvPbutton.y, this.rectPvPbutton.x1,this.rectPvPbutton.y1);
    ctx.lineWidth = 5;
    ctx.strokeRect(this.rectPvPbutton.x,this.rectPvPbutton.y, this.rectPvPbutton.x1,this.rectPvPbutton.y1);
    ctx.lineWidth = 1;
    this.rectPvPbutton.x1 += this.rectPvPbutton.x;
    this.rectPvPbutton.y1 += this.rectPvPbutton.y;
    
    ph+=0.075;

    text.render(str, canvas.width / 2 , canvas.height *ph);
   
    ph+=0.075;
    
    // Play with AI button
    ctx.fillStyle = "rgb(100,255,0)";
    this.rectAIbutton = { x: canvas.width*(1 -pw)/2, y: canvas.height *ph, x1:canvas.width* pw, y1: canvas.height *0.1};   
    ctx.fillRect(this.rectAIbutton.x,this.rectAIbutton.y, this.rectAIbutton.x1, this.rectAIbutton.y1);
    ctx.lineWidth = 5;
    ctx.strokeRect(this.rectAIbutton.x,this.rectAIbutton.y, this.rectAIbutton.x1, this.rectAIbutton.y1);
    ctx.lineWidth = 1;
    this.rectAIbutton.x1 += this.rectAIbutton.x;
    this.rectAIbutton.y1 += this.rectAIbutton.y;
    
    ph+=0.075;
    str = "Start new revolution";
    text.render(str, canvas.width / 2 , canvas.height *ph);
    
    text.resetFont();


};



//---------------------------------------------
// touch input

Lobby.prototype.touchstart = function (e) {
    e.preventDefault();
    this.onmousedown(e.targetTouches[0].pageX - canvas.offsetLeft, e.targetTouches[0].pageY - canvas.offsetTop);
};

Lobby.prototype.touchend = function (e) {
    e.preventDefault();
    this.onmouseup(e.changedTouches[0].pageX -canvas.offsetLeft, e.changedTouches[0].pageY - canvas.offsetTop);
};

Lobby.prototype.touchmove = function (e) {
    e.preventDefault();
};


//--------------------------------------------
// mouse input
//--------------------------------------------

Lobby.prototype.onmousedown = function(x, y) {

};

Lobby.prototype.onmousemove = function (x, y) {
};

Lobby.prototype.onmouseup = function (x, y) {
    if (x >= this.rectPvPbutton.x && y >= this.rectPvPbutton.y && x <= this.rectPvPbutton.x1 && y <= this.rectPvPbutton.y1)
    {
        multiplayer.StartPvP();
    } 
    else if (x >= this.rectAIbutton.x && y >= this.rectAIbutton.y && x <= this.rectAIbutton.x1 && y <= this.rectAIbutton.y1)
    {
        multiplayer.StartAI();
    }
};


Lobby.prototype.onrightmouseup = function (x, y) {
}

Lobby.prototype.mousewheel = function (e) {
    e.preventDefault();
}

//---------------------------------------------
// keyboard input

Lobby.prototype.onkeydown = function (e) {


}

Lobby.prototype.onkeypress = function (e) {


}

Lobby.prototype.onkeyup = function (e) {

}




