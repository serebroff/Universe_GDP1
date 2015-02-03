//-------------------------------------------------------
// Base class for the world object
//-------------------------------------------------------

// global vars
var world_scale = 1;

// costants

// acutal cell size for currect display, variable
var CELL_SIZE = 64;
var CELL_SCALE = 1;

WORLD_SIZE_X = 800;
WORLD_SIZE_Y = 500;
WORLD_SIZE_R = 250;

var LIGHT_SPEED = 120;
var GRAVITY = 8;
var MASS= 700;
var BIG_BANG_TIME = 1;
var COLAPSE_R = 0.3;

var LIGHT_SPEED0 = 0;
var LIGHT_SPEED1 = 220;

var GRAVITY0 = 0;
var GRAVITY1 = 15;

var MASS0= 0;
var MASS1= 1000;

var LIGHT_SPEED_slider=0.44;
var GRAVITY_slider = 0.33;
var MASS_slider = 0.33;


var num_objects_in_universe=0;
var universe_size=0;
var stable_state_time=0;
var big_bang_time = 1;


var num_of_runs=0;

// this size ia constant ana\d use to measure all bitmaps
var GOLDEN_CELL_SIZE = 64;


var COIN_LIFETIME = 1.5;
var COIN_APPTIME = 0.5;
var COIN_OFFTIME = 0.4;



World = function() {

    this.maptex = null;
    this.ar_coins = [];
    this.ar_enemies = [];
    this.ar_revs= [];

};



World.prototype.Load = function() {


    
    this.maptex = texturehost.Load('res/map.png');
    this.cointex = texturehost.Load('res/coin.png');
    this.cointex0 = texturehost.Load('res/coin0.png');
    WORLD_SIZE_X = 768; //this.maptex.width; 
    WORLD_SIZE_Y = 768;//this.maptex.height;

};

World.prototype.InitBeforeLevel = function() {
    this.ar_enemies=[];
    num_objects_in_universe=0;
    universe_size=0;
    stable_state_time=0;
    
    revdata.day =0;
    big_bang_time = BIG_BANG_TIME;
    
    for (var i = 0; i < MASS/2; i++)
    {
        this.AddEnemyOnMap();
    }

    

}

World.prototype.AddEnemyOnMap = function(pos) {

    var rnd=Math.random(); 
    rnd=Math.pow(rnd,1/2);
    var speed= new Vec2(0,LIGHT_SPEED*rnd);
    //speed.y*=speed.y;
    speed.rotate(2*Math.PI*Math.random());
    
    this.ar_enemies.push({"pos": new Vec2(0,0),//p,
        "speed": speed, //new Vec2(0,0),
        //"t":BIG_BANG_TIME,
        "r": 1,
        "m":1,
        "b_dead":false,
        "a": new Vec2(0,0)});
    
    //speed.negate();
    
    this.ar_enemies.push({"pos": new Vec2(0,0),//p,
        "speed": speed.negate(1), //new Vec2(0,0),
        //"t":BIG_BANG_TIME,
        "r": 1,
        "m":1,
        "b_dead":false,
        "a": new Vec2(0,0)});
    //*/
}

World.prototype.AddInitialRevs = function(x,y) {

}

World.prototype.AddRevOnMap = function(pos) {

}


World.prototype.ClickOnMap = function(x, y) {
    var c, i, dx, dy;
    for (i = 0; i < this.ar_coins.length; i++)
    {
        c = this.ar_coins[i];
        dx = (x - c.x);
        dy = (y - c.y);
        if ((dx * dx + dy * dy) < (this.cointex.width * this.cointex.width + 5))
        {
            game.popupinfo.AddFlyingInfoXY("+$" + c.value, c.x, c.y);
            gfx.Add(c.x,c.y,"coin_off");
            revdata.coins += c.value;
            this.ar_coins.splice(i, 1);
            break;
        }
    }

}

World.prototype.CalculateCoins = function() {
   
}

World.prototype.CalculateEnemies = function() {
    var cappos = new Vec2(capital.x, capital.y);
    
    num_objects_in_universe=0;   
    universe_size =0;
    stable_state_time+=secperframe;
    big_bang_time -= secperframe;

    // forces between objects and movement
    for (var i = 0; i < this.ar_enemies.length; i++)
    {
        var e = this.ar_enemies[i];

        if (e.b_dead)   continue;
        num_objects_in_universe++;
        
        var R = e.pos.lengthSquared();
        if (universe_size < R)
        {
            universe_size = R;
        }

        if (big_bang_time < 0)
        for (var j = i + 1; j < this.ar_enemies.length; j++)
        {
            var e2 = this.ar_enemies[j];
            if (e2.b_dead)
                continue;



            var dir = e.pos.subtract(e2.pos, 1);
            var r = dir.lengthSquared();


            // gravity force and acceleration
            dir.multiply(GRAVITY / r);
            e.a.subtract(dir.multiply(e2.m, 1));
            e2.a.add(dir.multiply(e.m, 1));

        }
     
        
/*        // calculate speed and new pos
        e.speed.add(e.a.multiply(2*secperframe,1));
        e.a.zero();
        var sl=e.speed.length();
        if (sl>=LIGHT_SPEED) {
            e.speed.multiply(LIGHT_SPEED/sl);
        }
        e.pos.add(e.speed.multiply(secperframe,1));
        
/*        
        if ( e.pos.x< -WORLD_SIZE_X / 2) { e.speed.x*=-1; e.pos.x= -WORLD_SIZE_X / 2 +1;}
        else if ( e.pos.x> WORLD_SIZE_X / 2) { e.speed.x*=-1; e.pos.x= WORLD_SIZE_X / 2 -1;}
        if ( e.pos.y< -WORLD_SIZE_Y / 2) { e.speed.y*=-1; e.pos.y= -WORLD_SIZE_Y / 2 +1;}
        else if ( e.pos.y> WORLD_SIZE_Y / 2) { e.speed.y*=-1; e.pos.y= WORLD_SIZE_Y / 2 -1;}
       // */
    }
    
    // movement
    for (var i = 0; i < this.ar_enemies.length; i++)
    {
        var e = this.ar_enemies[i];
        if (e.b_dead)   continue;
               // calculate speed and new pos
        e.speed.add(e.a.multiply(2*secperframe,1));
        e.a.zero();
        var sl=e.speed.length();
        if (sl>=LIGHT_SPEED) {
            e.speed.multiply(LIGHT_SPEED/sl);
        }
        e.pos.add(e.speed.multiply(secperframe,1));
    }
    
    if (big_bang_time > 0) return;

    // collision with other enemies
    for (var i = 0; i < this.ar_enemies.length; i++)
    {
        var e = this.ar_enemies[i];
        
        if (e.b_dead) continue;


        for (var j = i + 1; j < this.ar_enemies.length; j++)
        {
            var e2 = this.ar_enemies[j];
            if (e2.b_dead)
                continue;

            var dir = e.pos.subtract(e2.pos, 1);
            var r = dir.lengthSquared();


            // collision and collapse of one partilce
            var r2 = e.r + e2.r;
            r2 *= r2 * COLAPSE_R;
            if (r < r2)
            {
                e.speed.multiply(e.m);
                e2.speed.multiply(e2.m);
                e.speed.add(e2.speed);
                e.speed.divide(e.m + e2.m);

                e.pos.multiply(e.m);
                e2.pos.multiply(e2.m);
                e.pos.add(e2.pos);
                e.pos.divide(e.m + e2.m);

                e.m += e2.m;
                
                e.r = 1 + Math.pow(e.m, 1 / 3);//*0.1;
                e2.b_dead = true;
                
                stable_state_time = 0;
            }
 
        }

    }
    
    
}



World.prototype.CalculateRevs = function() {
    
}

World.prototype.Calculate = function() {
    revdata.day += secperframe;
/*
    var e=this.ar_enemies[0];
    
    if (game.bRightMouseDown)
    {
        e.b_dead = false;
        e.pos.x = Math.floor(game.MousePos.x / world_scale -
                (camera.pos.x * CELL_SIZE + canvas.width / 2 / world_scale));
        e.pos.y = Math.floor(game.MousePos.y / world_scale -
                (camera.pos.y * CELL_SIZE + canvas.height / 2 / world_scale));
        e.m=MASS;
    } else e.b_dead=true;
    */
    this.CalculateEnemies();
    
    this.CalculateCoins();
    if (revdata.revs == 0 && this.ar_revs.length == 0)
    {
        game.Loose();
    }

    if (revdata.cityRevs >= revdata.cityEnemy)
    {
        game.Win();
    }
    
};




World.prototype.DrawItemOnMap = function(img, x, y, r, k)
{

    var size = r;
    // draw dark coin on the bright one            

    ctx.drawImage(img, 0, 0, img.width, img.height * k,
            x - img.width * size / 2, y - img.height * size / 2,
            img.width * size, img.height * size * k);



}



World.prototype.Render = function() {

    // map
    var img = this.maptex;
/*    var size = 1;
    ctx.drawImage(img, 0, 0, img.width, img.height,
            -img.width * size / 2, -img.height * size / 2,
            img.width * size, img.height * size);

*/
    // enemies
    ctx.fillStyle = "rgb(255,255,255)";
    for (var i = 0; i < this.ar_enemies.length; i++)
    {
        var e = this.ar_enemies[i];
        if (e.b_dead) continue;
        var s = e.r;
        
        var b= Math.floor(255*(1-e.r/10));
        if (b<0) b=0;
        var c="rgb(255,255,"+b+")";
/*        switch(Math.floor(s-1))
        {
            case 1: c="rgb(244,255,167)"; break;
            case 2: c="rgb(255,237,31)"; break;
            case 3: c="rgb(255,132,0)"; break;
            case 4: c="rgb(255,36,0)"; break;
            case 5: c="rgb(255,96,227)"; break;
            case 6: c="rgb(114,99,255)"; break;
            case 7: c="rgb(55,198,255)"; break;
        }*/
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(e.pos.x, e.pos.y, s, 0, 2*Math.PI) ;
        ctx.fill();
        //ctx.fillRect(e.pos.x, e.pos.y, s, s);

    }
    // limit of universe
    ctx.strokeStyle = "rgb(0,160,0)";
    for (var i = 0; i < 6; i++)
    {
        ctx.beginPath();
        ctx.arc(0, 0, (WORLD_SIZE_Y / 2 )* (Math.pow(i,1.4) + 1), 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    if (game.b_menu)
    {
        ctx.strokeStyle = "rgb(180,180,0)";
        ctx.beginPath();
        ctx.moveTo(4,4);
        ctx.lineTo(30,30);
        ctx.stroke();

        text.font.size = 18;
        text.font.align = "left";
        text.font.color ="rgb(255,255,255)";
        text.renderWrapped(gametexts.intro, 40, 40, 200,30);
    }
        

  /*       // capital
     ctx.fillStyle = "rgb(255,0,0)";
     ctx.beginPath();
     ctx.arc(capital.x, capital.y, capital.r, 0, 2*Math.PI) ;
     ctx.fill();
     ctx.fillStyle = "rgb(0,0,0)";
     var k=revdata.cityRevs/revdata.cityEnemy;
     ctx.beginPath();
     ctx.arc(capital.x, capital.y, capital.r, -Math.PI/2 + Math.PI*k, 3*Math.PI/2- Math.PI*k) ;
     ctx.fill();
     
     ctx.beginPath();
     ctx.arc(capital.x, capital.y, capital.r2, 0, 2*Math.PI) ;
     ctx.stroke();
     text.font.b_stroke = false;
     k=Math.floor(k*100);
    if (k > 0)
    {
        text.font.size = 12;
        text.font.align = "center";
        text.font.color = "RGB(255,255,255)";
        text.render(k + '%', capital.x, capital.y+5);
    }
    text.font.size = 25;
     text.font.align="left";
     text.font.color = "RGB(0,0,0)";
     text.render(capital.name,capital.x + capital.r2,capital.y-capital.r2);

    */

};


