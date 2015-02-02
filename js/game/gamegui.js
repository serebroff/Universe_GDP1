
Game.prototype.RenderStats = function () {
    var p= new Vec2();
    
    var buttonwidth = 300, buttonheight = 40;
    var yy = canvas.height * 0.97;
    var dx = canvas.width * 0.03 + buttonwidth;
    var xx = canvas.width * 0.03;


    p.set(canvas.width*0.05, canvas.height*0.08);
    text.font.size = 20;
    text.font.align = "left";
    text.font.b_stroke = false;
      
    text.font.color ="rgb(80,180,0)"; 
    text.render("Objects: " + num_objects_in_universe, p.x,p.y);
    p.y+=30;
    text.render("Time:  " + Math.floor(revdata.day*23) + "M years", p.x,p.y);  
    p.y+=30;
    text.render("Universe raduis:  " + Math.floor(Math.sqrt(universe_size)*14) + "M parsec", p.x,p.y);  

    p.y+=30;
    text.render("Stable state time:  " + Math.floor(stable_state_time*23) + "M years", p.x,p.y);      

    
    
    p.set(canvas.width*0.95, canvas.height*0.08);
    text.font.align = "right";
    text.font.color ="rgb(80,180,0)";   
    text.render("FPS: " + fps.str_fps, p.x,p.y);
    p.y+=30;
    text.render("Zoom: " + Math.floor(world_scale*100) + '%', p.x,p.y);
    //text.render("Universe total mass: " + Math.ceil(MASS), p.x,p.y);

    text.font.size = 18;
    text.font.align = "left";
    text.font.color ="rgb(180,180,0)"; 
    p.set(canvas.width*0.03+60, canvas.height*0.97-40*3.8);
    text.render("Useless superpowers", p.x,p.y);
    
    
    if (game.b_menu)
    {   
        text.font.size = 30;
        text.font.align = "center";
        text.font.color ="rgb(180,180,0)";
        var h= text.getWrappedHeight(gametexts.mouse, canvas.width*0.3,40);
        text.renderWrapped(gametexts.mouse, canvas.width/2,canvas.height*0.98-h, canvas.width*0.3,40);
    }
        
    
    p.set(canvas.width*0.95, canvas.height*0.08);
    
    text.resetFont();    
}


Game.prototype.CalculateEvents = function () {

}

Game.prototype.AddUpgradeButtons = function () {
     var buttonwidth =300, buttonheight = 40;
     var yy= canvas.height*0.97;
     var dx= canvas.width *0.03 +buttonwidth;
     var xx = canvas.width *0.03;
     
    var TRUE_LIGHT_SPEED=299792.458;
    var TRUE_MASS=1.1 ; //10^53 kg
    var TRUE_GRAVITY= 6.67384; //"e-11 m^3 kg^-1 s^-2";
    //LIGHT_SPEED0/LIGHT_SPEED1 + LIGHT_SPEED_slider/0.5 +1
     
    gui.AddButton({'name':"b1",
        "x":xx, "y":yy-buttonheight*3.4,"x1":buttonwidth,"y1":buttonheight, 
        "fontsize":18,
        "tip":gametexts.h[0],
        "volume":LIGHT_SPEED_slider,
        "action": function(volume) { LIGHT_SPEED_slider = volume;} ,
        "txt": function()
        {
            //LIGHT_SPEED0/LIGHT_SPEED1 +1
            return "-           Light speed: " +  Math.ceil(LIGHT_SPEED_slider*100) + "%           +";
        },
    });
    //xx+=dx;
    gui.AddButton({'name':"b2",
        "x":xx, "y":yy-buttonheight*2.2,"x1":buttonwidth,"y1":buttonheight, 
        "tip":gametexts.h[1],
        "fontsize":18,
        "volume":GRAVITY_slider ,
        action: function(volume) { GRAVITY_slider = volume; },
        "txt": function()
        {
            //var k=((GRAVITY1-GRAVITY0)*(GRAVITY_slider-0.5))/((GRAVITY0+GRAVITY1)/2);
            return "-               Gravity: " + Math.ceil(GRAVITY_slider*100)  + "%               +";
        },
/*        "txt2": function()
        {
            return "50%";
        },*/
    }); 
    
    gui.AddButton({'name':"b3",
        "x":xx, "y":yy-buttonheight,"x1":buttonwidth,"y1":buttonheight, 
        "fontsize":18,
        "tip":gametexts.h[2],
        "volume":MASS_slider ,
        action: function(volume) { MASS_slider = volume; },
        "txt": function()
        {
            return "-        Universe mass: " + Math.ceil(MASS_slider*100)  + "%        +";
        },
/*        "txt2": function()
        {
            return "50%";
        },*/
    });     

    xx=canvas.width *0.97 -270;
    gui.AddButton({'name':"b4",
        "x":xx, "y":yy-70,"x1":270,"y1":70, 
        action: function() {
            game.b_menu = !game.b_menu;
            if (game.b_menu) { 
                soundhost.get("tick").play();
                game.InitBeforeLevel();
                game.DamageTimer=100;
            } else {
                soundhost.get("shoot"+(num_of_runs%3+1)).play();
                game.world.InitBeforeLevel();
                game.HitTimer=100;
            }
        },
        "txt": function()
        {
            return game.b_menu? "Start": "End";
        },
        "txt2": function()
        {
            return "Universe";
        },
        "color": "rgb(255,255,0)",
    });  
}







