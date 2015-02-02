//-------------------------------------------------------
// Base class for the game object
//-------------------------------------------------------

var game;

Game = function () {
    this.bMouseDown =false;
    this.bRightMouseDown =false;
    this.MousePath =0;
    this.b_firstclick = true;
    this.mousedowntimer =0;
    this.scaleDist = -1;
    this.numFingers = 0;
    this.DamageTimer = 0;
    this.HitTimer = 0;
    this.b_myTurn = true;
    
    this.level_random_seed = 0;
    this.b_PlayerReceiver = false;
    
    this.b_PvP = false;
    
    this.world= new World;
    this.b_win = false;
    this.b_menu = true;

    this.popupinfo = new PopupInfo;
    
    //this.players = new Players;
    
    // path finding grid
    this.grid = [];
    
};

Game.prototype.Load = function () {


     this.MousePos = new Vec2(canvas.width / 2, canvas.height / 2);
     this.MousePos0 = new Vec2(canvas.width / 2, canvas.height / 2);

    // terrain
    this.grassImg = new Image();
    this.grassImg.src = 'res/grass.jpg';
    this.grassImg.onload = function() {
        game.terrain_pattern = ctx.createPattern(game.grassImg, "repeat");
    };

   soundhost.Load("shoot1");
   soundhost.Load("shoot2");
   soundhost.Load("shoot3");
   soundhost.Load("tick");


    camera = new Camera();
    
    this.world.Load();

 
    this.popupinfo.Load();
    
};

Game.prototype.InitBeforeLevel = function () {

    this.b_myTurn = true;
    this.RevTime = 0;
    
    multiplayer.EnterGame();
    
    // init random generator
    rnd.init();
    if (!this.b_PlayerReceiver)
    { // if we are host - generate seed value
        this.level_random_seed = Math.floor(Math.random() * 0xffff);
    }
    
    rnd.randomize(this.level_random_seed);
            
    camera.newworldscale=1;
    camera.move(0,0);
    gui.Init();
    this.AddUpgradeButtons();
    
  /*    
    gui.AddPopup({
        name:'p1', x: canvas.width/2, y: canvas.height/2,
        w: 700, h: 260,
        txt: gametexts.intro,
        buttons: [
        {
            txt: "OK",
            action: function() { return "closepopup"; },
        }]
    });
*/
    
    this.popupinfo.InitBeforeLevel();
    this.world.InitBeforeLevel();
    camera.setpos(0,0);
    
}

Game.prototype.PRupgrage = function () {
    if (revdata.PRlvl == upgrades.PR.length) return;
    if (upgrades.PR[revdata.PRlvl].cost <= revdata.coins)
    {
        revdata.coins -= upgrades.PR[revdata.PRlvl].cost;
        revdata.PR+=upgrades.PR[revdata.PRlvl].raise;
        revdata.PRlvl++;
    }
}

Game.prototype.ATKupgrage = function () {
    if (revdata.ATKlvl == upgrades.ATK.length) return;
    if (upgrades.ATK[revdata.ATKlvl].cost <= revdata.coins)
    {
        revdata.coins -= upgrades.ATK[revdata.ATKlvl].cost;
        revdata.ATK+=upgrades.ATK[revdata.ATKlvl].raise;
        revdata.ATKlvl++;
    }
}

Game.prototype.Loose = function () {
    gameover.b_win = false;
    ChangeInterface(gameover);
}


Game.prototype.Win = function () {
    gameover.b_win = true;
    ChangeInterface(gameover);
}

Game.prototype.OpponentLeave = function () {
    gameover.b_win = true;
    gameover.b_opponentLeft = true;
    ChangeInterface(gameover);
}


Game.prototype.SetGameOver = function () {
    ChangeInterface(gameover);
}

Game.prototype.IsMyTurn = function () {
    return this.b_myTurn;
}

Game.prototype.NextTurn = function () {

}

Game.prototype.Calculate = function () {

    if (this.bMouseDown) this.mousedowntimer += tickperframe ;
    else this.mousedowntimer = 0;

    LIGHT_SPEED = LIGHT_SPEED0 * (1-LIGHT_SPEED_slider) + LIGHT_SPEED1 * LIGHT_SPEED_slider;
    GRAVITY = GRAVITY0 * (1-GRAVITY_slider) + GRAVITY1 *GRAVITY_slider;
    MASS = MASS0 * (1-MASS_slider) + MASS1 *MASS_slider;
  
    gui.Calculate();        
    camera.Calculate();
    if (!this.b_menu)  this.world.Calculate();
    this.popupinfo.Calculate();
    this.CalculateEvents();
    this.RevTime += secperframe;
    

};


Game.prototype.Render = function() {
    

    camera.LoadToCanvas();
/*
    // draw terrain
    ctx.fillStyle = this.terrain_pattern;
    var w = canvas.width  / world_scale;
    var h = canvas.height  / world_scale;
    //ctx.fillRect(-camera.pos.x * CELL_SIZE -w/2, -camera.pos.y * CELL_SIZE - h/2, w, h);
    ctx.fillRect(CELL_SIZE+1, CELL_SIZE+1, (WORLD_SIZE -2) * CELL_SIZE -1, (WORLD_SIZE -2) * CELL_SIZE -1);

*/
    this.world.Render();
    
    
    
    gfx.Render();
    this.popupinfo.Render();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    this.popupinfo.RenderOverScreen();

    // Damage Red Rect over screen
    if (this.DamageTimer>0)
    {
        ctx.fillStyle = "rgb(255,0,0)"; //"black"; //#AA0000";// "cyan";
        ctx.globalAlpha = Math.sin(this.DamageTimer *0.08)*0.5 + 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.DamageTimer -= tickperframe;
        ctx.globalAlpha = 1;
    }

    if (this.HitTimer > 0)
    {
        ctx.fillStyle = "rgb(0,255,0)"; 
        ctx.globalAlpha = Math.sin(this.HitTimer *0.08)*0.5 + 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.HitTimer -= tickperframe;
        ctx.globalAlpha = 1;
    }
            

    //this.players.DrawPlayerScore();
    this.RenderStats();
    gui.Render();
};



//---------------------------------------------
// touch input

Game.prototype.touchstart = function(e)   
{
    e.preventDefault();
    this.numFingers = e.touches.length;
    this.bMouseDown = true;
    
    // one finger goes down
    if (this.numFingers == 1)
    {
        this.onmousedown(e.targetTouches[0].pageX - canvas.offsetLeft, e.targetTouches[0].pageY - canvas.offsetTop);
    }


}; 
Game.prototype.touchend = function (e) 
{      
    e.preventDefault();
    
    // one finger goes up, others are up already
    if (this.numFingers == 1 && e.touches.length==0)
    {
        this.onmouseup(e.changedTouches[0].pageX -canvas.offsetLeft, e.changedTouches[0].pageY - canvas.offsetTop);
    }
    // one finger goes up and others (>=2) stays down
    else if (this.numFingers >= 2 && e.touches.length==1)
    {   
        // stop scaling
        this.scaleDist = -1;
        this.mousedowntimer = 200;
        this.MousePath =CELL_SIZE;
        this.MousePos.x = e.touches[0].pageX - canvas.offsetLeft;
        this.MousePos.y = e.touches[0].pageY - canvas.offsetTop;
    }
    // all finger goes up (>=2)
    else if (this.numFingers >= 2 && e.touches.length == 0)
    {
        this.MousePath =0;
        this.bMouseDown = false;
        this.bAiming = false;
        this.scaleDist = -1;
    }
    
    this.numFingers = e.touches.length;
}; 

Game.prototype.touchmove = function (e) 
{    
    e.preventDefault();
    this.numFingers = e.touches.length;
    // one finger move - move the camera
    if (this.numFingers == 1)
    {
        this.onmousemove(e.targetTouches[0].pageX - canvas.offsetLeft, e.targetTouches[0].pageY -canvas.offsetTop);
    }
    else 
    {   // several fingers - scale by two first
        var p1 = new Vec2(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
        var p2 = new Vec2(e.targetTouches[1].pageX, e.targetTouches[1].pageY);
        p1.subtract(p2);
        var s = p1.length();
        if (this.scaleDist > 0)
        {
            camera.scale(s / this.scaleDist);
        }
        this.scaleDist = s;
    }        
};     


//--------------------------------------------
// mouse input
//--------------------------------------------

Game.prototype.onmousedown = function (x,y) {
 
    this.bMouseDown = true;
    // get pos from event e
    this.MousePos.x = x;
    this.MousePos.y = y;
    //gui.onmousemove(x, y);
    if (gui.onmouseup(x,y)) return;
    
    
};

Game.prototype.onmousemove = function(x, y) {
    if (!gui.onmousemove(x, y)) {
        if (this.bMouseDown)// && this.mousedowntimer > 100)
        {
            // move camera if mouse is down
            var MouseMoveVec = new Vec2(this.MousePos.x - x, this.MousePos.y - y);
            this.MousePath += MouseMoveVec.length();
            if (!this.bAiming)// && !camera.bFollowHero)
            {
                camera.UnfollowHero();
                camera.move(this.MousePos.x - x, this.MousePos.y - y);
            }
            //}
        }
    }
    
    this.MousePos.x = x;
    this.MousePos.y = y;
    
//    gui.onmousemove(x,y);
};

Game.prototype.onmouseup = function (x,y) {
    
    this.bMouseDown =false;
    this.MousePos.x = x;
    this.MousePos.y = y;
    
    //if (gui.onmouseup(x,y)) return;
    


    // Tap!!!
    if (this.MousePath < (CELL_SIZE * 0.3) && this.mousedowntimer < 200 )
    {
        // get pos from event e
        var cellx, celly;
/*        cellx = Math.floor(x / (CELL_SIZE * world_scale) -
                (camera.pos.x + canvas.width / 2 / (CELL_SIZE * world_scale)));
        celly = Math.floor(y / (CELL_SIZE * world_scale) -
                (camera.pos.y + canvas.height / 2 / (CELL_SIZE * world_scale)));
        //this.units.Tap(cellx, celly);
  */      
        cellx = Math.floor(x /  world_scale -
                (camera.pos.x*CELL_SIZE + canvas.width / 2 /  world_scale));
        celly = Math.floor(y /   world_scale -
                (camera.pos.y*CELL_SIZE  + canvas.height / 2 /  world_scale));
        
        if (this.b_firstclick) {
            this.world.AddInitialRevs(cellx, celly );
            this.b_firstclick = false;
        }
        
        this.world.ClickOnMap(cellx, celly);

    }   


    this.bAiming = false;
    this.MousePath =0;
};

Game.prototype.onrightmousedown= function(x, y) {
    //this.bMouseDown = true;
    this.bRightMouseDown =true;
}
Game.prototype.onrightmouseup = function(x, y) {
    //this.bMouseDown = false;
    this.bRightMouseDown =false;
    //this.units.SelectNextUnit();

}

Game.prototype.mousewheel = function(e) {
    e.preventDefault();
    var delta = (e.detail < 0 || e.wheelDelta > 0) ? 1 : -1;
    camera.scale(1 + delta*0.1, canvas.width / 2, canvas.height / 2);
}

//---------------------------------------------
// keyboard input

Game.prototype.onkeydown = function (e) {

    // e.whitch contains charcode of pressed key

    // left
    if (e.which == 37)
    {
        camera.scale(0.9, canvas.width / 2, canvas.height / 2);
    }
    // right
    if (e.which == 39)
    {
        camera.scale(1.1, canvas.width / 2, canvas.height / 2);
    }
    // up
    if (e.which == 38)
    {
   
    }
    ;
    // down
    if (e.which == 40)
    {

    }
    ;

}

Game.prototype.onkeypress = function (e) {


}
   
Game.prototype.onkeyup = function (e) {

}




