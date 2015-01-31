/* 
 * GFX
 * 
 */

var gfx = {
    gfx_desc: [
        {// 
        name: 'skull_red',
        size0: 0,
        size1: 0.7,
        time: 800,
        calc: function() { g.y-=30*secperframe; }
    },
    {// 
        name: 'skull_black',
        size0: 0,
        size1: 0.7,
        time: 800,
        calc: function() { g.y-=30*secperframe; }
    },
    {// 
        name: 'coin_off',
        size0: 0,
        size1: 1,
        time: 1000,
    },
    {// 
        name: 'fight',
        size0: 0,
        size1: 1,
        time: 400,
    },
    ],
    gfx_sprites: [],
    ar_gfx: [],
    Load : function()
    {
        var i, tex;
        for (i = 0; i < this.gfx_desc.length; i++)
        {
            tex = texturehost.Load('res/gfx/' +this.gfx_desc[i].name + '.png');
            this.gfx_sprites.push(tex);
        }
        
    },
    Add: function(x,y,name)
    {
        var i;
        for (i = 0; i < this.gfx_desc.length; i++)
        {
            if (name == this.gfx_desc[i].name)
            {
                this.ar_gfx.push({
                    index: i,
                    x: x,
                    y: y,
                    t: 0
                });
                return;
            }
        }        
    },
    Render: function()
    {
        var gfx, desc, img;
        var size;
        var i;
        for (i = 0; i < this.ar_gfx.length; i++)
        {
            g = this.ar_gfx[i];
            desc = this.gfx_desc[g.index];
            img = this.gfx_sprites[g.index];
            
            var k = g.t / desc.time;
            
            var sqk = Math.sqrt(k);
            size = desc.size0 *(1-sqk) + desc.size1 *sqk;
           // size *= CELL_SCALE;
           if (typeof desc.calc !== 'undefined') 
               {
                   desc.calc();
               }
            
            ctx.globalAlpha = 1- k*k;
            ctx.drawImage(img, 0,0, img.width , img.height ,
                g.x - img.width *size /2, g.y - img.width *size /2, img.width *size, img.height *size);

            g.t += tickperframe;
            if (g.t > desc.time)
            {
                this.ar_gfx.splice(i, 1);
                i--;
            }
        }        
        ctx.globalAlpha = 1;
    }

};
