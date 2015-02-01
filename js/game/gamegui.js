
Game.prototype.RenderStats = function () {
    var p= new Vec2();
    
    var buttonwidth = 250, buttonheight = 40;
    var yy = canvas.height * 0.97;
    var dx = canvas.width * 0.03 + buttonwidth;
    var xx = canvas.width * 0.03;


    p.set(canvas.width*0.05, canvas.height*0.08);
    text.font.size = 24;
    text.font.align = "left";
    text.font.b_stroke = false;
      
    text.font.color ="rgb(80,180,0)"; 
    text.render("Objects: " + num_objects_in_universe, p.x,p.y);
    p.y+=45;
    text.render("Time:  " + Math.floor(revdata.day*23) + "M years", p.x,p.y);    
    
    p.set(canvas.width*0.95, canvas.height*0.08);
    text.font.align = "right";
    text.font.color ="rgb(80,180,0)";   
    text.render("Universe total mass: " + Math.ceil(MASS), p.x,p.y);

    text.font.size = 18;
    text.font.align = "left";
    text.font.color ="rgb(180,180,0)"; 
    p.set(canvas.width*0.03+30, canvas.height*0.97-40*3.8);
    text.render("Useless superpowers", p.x,p.y);
    
    p.set(canvas.width*0.95, canvas.height*0.08);
    
    text.resetFont();    
}


Game.prototype.CalculateEvents = function () {

}

Game.prototype.AddUpgradeButtons = function () {
     var buttonwidth =250, buttonheight = 40;
     var yy= canvas.height*0.97;
     var dx= canvas.width *0.03 +buttonwidth;
     var xx = canvas.width *0.03;
     
    var TRUE_LIGHT_SPEED=299792.458;
    //LIGHT_SPEED0/LIGHT_SPEED1 + LIGHT_SPEED_slider/0.5 +1
     
    gui.AddButton({'name':"b1",
        "x":xx, "y":yy-buttonheight*3.4,"x1":buttonwidth,"y1":buttonheight, 
        "fontsize":18,
        "volume":LIGHT_SPEED_slider,
        "action": function(volume) { LIGHT_SPEED_slider = volume;} ,
        "txt": function()
        {
            //LIGHT_SPEED0/LIGHT_SPEED1 +1
            return "Light speed: " + Math.ceil((400/700 +LIGHT_SPEED_slider) *299792.458 ) + " km/s";
        },
    });
    //xx+=dx;
    gui.AddButton({'name':"b2",
        "x":xx, "y":yy-buttonheight*2.2,"x1":buttonwidth,"y1":buttonheight, 
        "fontsize":18,
        "volume":GRAVITY_slider ,
        action: function(volume) { GRAVITY_slider = volume; },
        "txt": function()
        {
            return "Gravity: " + Math.ceil(GRAVITY_slider*100)  + "%";
        },
/*        "txt2": function()
        {
            return "50%";
        },*/
    }); 
    
    gui.AddButton({'name':"b3",
        "x":xx, "y":yy-buttonheight,"x1":buttonwidth,"y1":buttonheight, 
        "fontsize":18,
        "volume":MASS_slider ,
        action: function(volume) { MASS_slider = volume; },
        "txt": function()
        {
            return "Universe mass: " + Math.ceil(MASS_slider*100)  + "%";
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
                game.InitBeforeLevel();
                game.DamageTimer=100;
            } else {
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







