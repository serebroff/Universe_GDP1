//-------------------------------------------------------
// Base class for inventory
//-------------------------------------------------------

var gui = {
    ar_buttons:[],
    ar_popups: [],
    
    // consts
    CLICKTIME: 0.3,
    POPUP_BUTTON_H: 40,
    POPUP_BUTTON_W: 200,
    
    Load : function() {
    },

    Init : function() {
        this.ar_buttons.lenght = 0;
        this.ar_popups.lenght = 0;
    },
    OnResize : function() {
        
    },

    AddPopup : function(params) { 
        this.ar_popups.push(params); //{"name":name,"txt":txt, "x":x,"y":y,"x1":x1,"y1":y1 });
        var p= this.ar_popups[this.ar_popups.length -1];
        var xx = p.x - this.POPUP_BUTTON_W/2;
        var yy = p.y + p.h/2 - this.POPUP_BUTTON_H*(1.5*p.buttons.length);
        for (var i=0; i<p.buttons.length; i++)
        {
            var b =this.AddButton({ name: 'b1', 
            x: xx,
            y: yy + i*(this.POPUP_BUTTON_H*1.5),
            x1: this.POPUP_BUTTON_W,
            y1: this.POPUP_BUTTON_H,
            action: p.buttons[i].action,
            txt: p.buttons[i].txt,
            popupindex: this.ar_popups.length -1, 
            });
            p.buttons[i].buttonindex = this.ar_buttons.length -1;
         }
    },

    AddButton : function(params) { 
        this.ar_buttons.push(params); 
        var b= this.ar_buttons[this.ar_buttons.length -1];
        b.b_mouseover = false;
        b.clicktime = 0;
        b.b_popup = false;
        return b;
    },
    Calculate: function() {
        var i, b;
        var popup_index = -1;
        for (i = 0; i < this.ar_buttons.length; i++)
        {
            b= this.ar_buttons[i];
            if (b.clicktime>0) {
                b.clicktime -= secperframe;
                if (b.clicktime<=0) {
                    b.clicktime =0;
                    if (b.action() == "closepopup")
                    {
                        popup_index = b.popupindex;
                    };
                }
            }
        }
        // close pop up?
        if (popup_index >= 0)
        {
            var p = this.ar_popups[popup_index];
            // delete buttons
            this.ar_buttons.splice(p.buttons[0].buttonindex, p.buttons.length);
            // delete popup
            this.ar_popups.splice(popup_index, 1);
            //for (i=0; i<p.buttons.length; i++)
        }
        if (this.ar_popups.length>0) secperframe=0;
    },
    RenderPopup : function(p) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.lineWidth = 3;
        ctx.fillRect(p.x-p.w/2, p.y-p.h/2,  p.w, p.h);
        ctx.strokeRect(p.x-p.w/2, p.y-p.h/2,  p.w, p.h);
        text.resetFont();
        text.renderWrapped(p.txt , p.x, p.y -p.h/2 + this.POPUP_BUTTON_H,p.w- 2*this.POPUP_BUTTON_H, 30);
        for (var i = 0; i < p.buttons.length; i++)
        {
            this.RenderButton(this.ar_buttons[p.buttons[i].buttonindex]);
        }
    },      
    RenderButton: function(b)
    {
        // Button color
        if (b.b_mouseover) {
            ctx.fillStyle = "rgb(130,255,0)";
            ctx.lineWidth = 3;
        }
        else
            ctx.fillStyle = "rgb(100,255,0)";
        
        
        var ds = 0, ks;
        if (b.clicktime > 0) {
            var k = b.clicktime / this.CLICKTIME;
            ks = Math.sin(Math.PI * k);
            ctx.fillStyle = "rgb(100,255," + Math.floor(200 * ks) + ")";
            ds = Math.floor(5 * ks);
            text.font.size = 24 + 2 * ks;
        }

        text.font.b_stroke = false;
        ctx.fillRect(b.x - ds, b.y - ds, b.x1 + 2 * ds, b.y1 + 2 * ds);

        ctx.strokeRect(b.x - ds, b.y - ds, b.x1 + 2 * ds, b.y1 + 2 * ds);
        ctx.lineWidth = 1;
        var yy= text.font.size * 1.2;
       if (typeof b.txt2 === 'undefined') yy=b.y1/2 + text.font.size * 0.4;
        text.render(typeof b.txt == 'string' ? b.txt : b.txt(), b.x + b.x1 / 2, b.y + yy );
        if (typeof b.txt2 !== 'undefined')
        {
            text.render(typeof b.txt2 == 'string' ? b.txt2 : b.txt2(), b.x + b.x1 / 2, b.y + text.font.size * 2.4);
        }

        text.resetFont();
    },
    Render : function() {
        var i;
        for (i = 0; i < this.ar_popups.length; i++) {
            this.RenderPopup(this.ar_popups[i]);
        }
        
        for (i = 0; i < this.ar_buttons.length; i++) {
            if (typeof this.ar_buttons[i].popindex === 'undefined')
            {
                this.RenderButton(this.ar_buttons[i]);
            }
        }
    },
    onmouseup: function(x,y) {
       // if pop up ia active check only last popup buttons
        if (this.ar_popups.length > 0)
        {
            var p = this.ar_popups[this.ar_popups.length - 1];

            for (var i = 0; i < p.buttons.length; i++)
            {
                var b = this.ar_buttons[p.buttons[i].buttonindex];
                if (x > b.x && x < (b.x + b.x1) && y > b.y & y < (b.y + b.y1)) {
                    b.clicktime = this.CLICKTIME;
                    return true;
                }
            }
            return true;
        }
        
        for (var i = 0; i < this.ar_buttons.length; i++)
        {
            var b= this.ar_buttons[i];
            if (x > b.x && x < (b.x+b.x1) && y > b.y & y < (b.y+b.y1)) {
                b.clicktime = this.CLICKTIME;
                return true;
            }
        }
    },
    onmousemove: function(x,y) {
        var i, b;
        for (i = 0; i < this.ar_buttons.length; i++)
        {
            b= this.ar_buttons[i];
            if (x > b.x && x < (b.x+b.x1) && y > b.y & y < (b.y+b.y1)) {
                b.b_mouseover = true;
            }
            else b.b_mouseover = false;
        }        
    }
}
