//-------------------------------------------------------
// Base class for camera
//-------------------------------------------------------

var camera;

Camera = function () {

    this.scalefactors = [0.5, 0.75, 1, 1.25, 1.5];

    this.newworldscale = 1;

    this.bFollowHero = false;
    this.bHeroCaught = false;
    
    this.pos = new Vec2(0,0);
    
    // screen rect in cell unnits
    this.screenX0=0;
    this.screenY0=0;
    this.screenX1=0; 
    this.screenY1=0;
    this.distX=0; 
    this.distY=0;
    
};

Camera.prototype.Load = function () {

};



Camera.prototype.Calculate = function () {
    
    // smooth scale
    if (world_scale != this.newworldscale) {
        world_scale += (this.newworldscale - world_scale) * secperframe * 4 ;
        if (Math.abs(world_scale - this.newworldscale) < 0.005) world_scale = this.newworldscale;
    }
    
 
};


Camera.prototype.LoadToCanvas = function() {

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(world_scale, world_scale);
    ctx.translate(canvas.width / 2 / world_scale + camera.pos.x * CELL_SIZE,
            canvas.height / 2 / world_scale + camera.pos.y * CELL_SIZE);
}

Camera.prototype.SwitchFollowHero = function () {
    this.bFollowHero = !this.bFollowHero;
    this.bHeroCaught = false;
}

Camera.prototype.FollowHero = function () {
    this.bFollowHero = true;
    this.bHeroCaught = false;
}

Camera.prototype.UnfollowHero = function () {
    this.bFollowHero = false;
    this.bHeroCaught = false;
}

Camera.prototype.setpos = function (x,y) {    
    this.pos.set(x,y);
};

Camera.prototype.move = function (dx,dy) {    
        camera.pos.x -= dx / (CELL_SIZE * world_scale);
        camera.pos.y -= dy / (CELL_SIZE * world_scale);
};


Camera.prototype.scale = function (s, centerX, centerY) {
    this.newworldscale *= s;
    var min = this.scalefactors[0];
    var max = this.scalefactors[this.scalefactors.length - 1];
    if (this.newworldscale < min) this.newworldscale = min;
    else if (this.newworldscale > max) this.newworldscale = max;
};

Camera.prototype.scaleUp = function () {

    var a, b, i;
    for (i = 0; i < this.scalefactors.length - 1 ; i++) {
        a = this.scalefactors[i];
        b = this.scalefactors[i + 1];
        if (a <= this.newworldscale && this.newworldscale < b) {
            this.newworldscale = b;
            return;
        }
    }
}

Camera.prototype.scaleDown = function () {
    var a, b, i;
    for (i = 0; i < this.scalefactors.length - 1 ; i++) {
        a = this.scalefactors[i];
        b = this.scalefactors[i + 1];
        if (a < this.newworldscale && this.newworldscale <= b) {
            this.newworldscale = a;
            return;
        }
    }
}