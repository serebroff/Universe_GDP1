// ----------------------------------------
// main.js - entry point of program
// Sets up game loop and all calls to game.js where actual game code goes
//-----------------------------------------

// Global vars
fps = null; 
canvas = null;
ctx = null;

// number of miliseconds in current frame
var tickperframe = 0;
// number of seconds in current frame, choose what is best for your needs
var secperframe = 0;
var console = "";

var current_interface;

// ----------------------------------------



function GameTick(elapsed)
{
    secperframe = elapsed;
    tickperframe = elapsed*1000;

    fps.update(secperframe);

    // all game calculations here
    current_interface.Calculate();

    // reset transformation matrix to indentity
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Clear the screen
    ctx.fillStyle = "black"; //#AA0000";// "cyan";"rgb(86,142,199)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // game render
    current_interface.Render();
    
    ctx.setTransform(1, 0, 0, 1,0, 0);

    
    // Draw FPS
    ctx.fillStyle = "#FF00AA";
    ctx.font = "15px Arial Black";
    ctx.fillText("FPS: " + fps.str_fps, 20, 20);
    //ctx.fillText("FPS: " + fps.str_fps + "       Scale: " +Math.floor(world_scale*100) + '%', 20, 20);
    //ctx.fillText("W: " + canvas.width + " H: " + canvas.height + " CELL:" +CELL_SIZE, 20, 40);
    
    devlog.render();
    //ctx.fillText(console, 20, 60);
    //ctx.fillText(world_scale, 20, 60);
}


// convert cursor pos to canvas coords
function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
    }
    
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    
    return new Vec2(x, y);
}

function GetViewportRect()
{
    var e = window, a = 'inner';
    if (!('innerWidth' in window))
    {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {width: e[ a + 'Width' ], height: e[ a + 'Height' ]}
}

function SetCanvasSize()
{
    var viewport = GetViewportRect();
    canvas.width = viewport.width ;
    canvas.height = viewport.height ;
    
    // if retina dysplay scale doc to 0.5
    if (window.devicePixelRatio == 2)
    {
        if (canvas.width < 500)
        {
            canvas.width *= 2;
            canvas.height *= 2;
        }
        document.getElementById("viewport").setAttribute("content",
                "width=device-width, initial-scale=0.5, user-scalable=no");
    }   
    var diag = Math.sqrt(canvas.width*canvas.width + canvas.height* canvas.height);
    CELL_SIZE = Math.floor(diag /20);
    if (CELL_SIZE>85) CELL_SIZE = 85;
    if (CELL_SIZE<45) CELL_SIZE = 45;
    CELL_SCALE = 0.8 * CELL_SIZE /GOLDEN_CELL_SIZE;
    
    //CELL_SIZE = 64;
    //CELL_SCALE = 1;
    
};

window.onresize = function(event) {
  SetCanvasSize();
  //  game.inventory.OnResize();
  gui.Init();
  game.AddUpgradeButtons();

};

// check is right mouse button pressed (cross-browser)
function isRightMB(e)
{
    var isRightPressed;
    if ("which" in e)
        isRightPressed = e.which == 3; // Gecko (Firefox), WebKit (Safari/Chrome) & Opera            
    else if ("button" in e)
        isRightPressed = e.button == 2; // IE, Opera 
    return isRightPressed;
}

//var worldobjblueprints;

window.onload = function () {

  //  worldobjblueprints = require('./config/worldobjs.json');
    canvas = document.getElementById("screen");
    
    SetCanvasSize();
    

    
    ctx = canvas.getContext("2d");
    fps = new FPSMeter();

    text.Load();
    
    loading = new Loading;
    loading.Load();
    
    current_interface = loading;

    GameLoopManager.run(GameTick);
        
    lobby = new Lobby;
    lobby.Load();
    
    game = new Game;
    game.Load();

    gameover = new GameOver;
    gameover.Load();

    gfx.Load();
    
    canvas.oncontextmenu=function (e) 
    {
        return false;
    }
    canvas.onmousedown = function (e) 
    {   
        e.preventDefault();
        var p = getCursorPosition(e);
        if (!isRightMB(e)) current_interface.onmousedown(p.x, p.y);    
    };
    canvas.onmousemove = function (e) 
    {          
        e.preventDefault();
        var p = getCursorPosition(e);  
        if (!isRightMB(e)) current_interface.onmousemove(p.x, p.y);    
    }; 
    canvas.onmouseup = function (e) 
    {  
        e.preventDefault();
        var p = getCursorPosition(e);

        if (isRightMB(e) ) current_interface.onrightmouseup(p.x, p.y);
        else current_interface.onmouseup(p.x, p.y);
    }; 
    
    canvas.addEventListener("touchstart", function(e) {   current_interface.touchstart(e);   }, false);
    canvas.addEventListener("touchmove", function(e) {   current_interface.touchmove(e);   }, false);
    canvas.addEventListener("touchend", function(e) {   
        current_interface.touchend(e);   
    }, false);
    canvas.addEventListener("mousewheel", function(e) {current_interface.mousewheel(e); }, false);
    // Firefox
    canvas.addEventListener("DOMMouseScroll", function(e) {current_interface.mousewheel(e); }, false);
    //canvas.addEventListener("touchcancel", touchCancel, false);
    
/*
    canvas.touchstart = function (e) {      current_interface.touchstart(e);    }; 
    canvas.touchend = function (e) {      current_interface.touchend(e);    }; 
    canvas.touchmove = function (e) {      current_interface.touchmove(e);    };     
 */
    document.onkeydown = function (e) {      
        if (e.which == 66) devlog.onoff();
        current_interface.onkeydown(e);    
    };
    document.onkeypress = function (e) {      current_interface.onkeypress(e);    };
    document.onkeyup = function (e) {      current_interface.onkeyup(e);    };
};

function ChangeInterface(new_interface) {
    if (typeof new_interface.PrepareInterface != 'undefined') 
    {
        new_interface.PrepareInterface();
    }
    current_interface = new_interface;
}

//-------------------------------------------------
//  Full screen mode
//
//-------------------------------------------------

function cancelFullScreen(el) {
    var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function requestFullScreen(el) {
    // Supports most browsers and their versions.
    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    return false
}

function toggleFull() {
    var elem = document.body; // Make the body go full screen.
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);

    if (isInFullScreen) {
        cancelFullScreen(document);
    } else {
        requestFullScreen(elem);
    }
    return false;
}