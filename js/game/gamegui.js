
Game.prototype.RenderStats = function () {
    var p= new Vec2();


    text.font.size = 40;
    text.font.align = "left";

    p.set(canvas.width*0.05, canvas.height*0.08);
    text.font.size = 30;
    text.font.align = "left";
    text.font.b_stroke = false;
      
    text.font.color ="rgb(80,180,0)"; 
    text.render("Objects: " + num_objects_in_universe, p.x,p.y);
    p.y+=55;
    text.render("Time:  " + Math.floor(revdata.day) + "M years", p.x,p.y);    
    
    p.set(canvas.width*0.95, canvas.height*0.08);
    text.font.align = "right";
    text.font.color ="rgb(80,180,0)";   
    text.render("Universe total mass: " + MASS_VOLUME, p.x,p.y);
    
    
    text.resetFont();
    

}

Game.prototype.CalculateEvents = function () {

}

Game.prototype.AddUpgradeButtons = function () {
     var buttonwidth =250, buttonheight = 70, numbuttons= 4;
     var yy= canvas.height*0.97;
     var dx= canvas.width *0.03 +buttonwidth;
     var xx = canvas.width *0.03;

    gui.AddButton({'name':"b1",
        "x":xx, "y":yy-buttonheight,"x1":buttonwidth,"y1":buttonheight, 
        "action": function() { game.PRupgrage()} ,
        "txt": function()
        {
            return "Light speed: 49%";
        },
    });
    xx+=dx;
    gui.AddButton({'name':"b2",
        "x":xx, "y":yy-buttonheight,"x1":buttonwidth,"y1":buttonheight, 
        action: function() { game.ATKupgrage()},
        "txt": function()
        {
            return "Gravity: 30%";
        },
/*        "txt2": function()
        {
            return "50%";
        },*/
    }); 

    xx=canvas.width *0.97 -300;
    gui.AddButton({'name':"b4",
        "x":xx, "y":yy-90,"x1":300,"y1":90, 
        action: function() {
            game.b_menu = !game.b_menu;
            if (game.b_menu) game.InitBeforeLevel();
        },
        "txt": function()
        {
            return game.b_menu? "Start Universe": "End Universe";
        },
        "color": "rgb(255,255,0)",
    });  
}







