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
        this.ar_buttons= [];//.lenght = 0;
        this.ar_popups=[];//.lenght = 0;
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
    GetButtonByName: function(name) {
        for (var i=0; i<this.ar_buttons.length; i++)
            {
                var b= this.ar_buttons[i];
                if (b.name==name) return b;
            }
    },       
    AddButton : function(params) { 
        this.ar_buttons.push(params); 
        var b= this.ar_buttons[this.ar_buttons.length -1];
        b.b_mouseover = false;
        b.clicktime = 0;
        b.b_popup = false;
        if (typeof b.fontsize === 'undefined')
            {
                b.fontsize=24;
            }
        //b.volume = 1;
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
        ctx.lineWidth = 3
        ctx.strokeStyle = "rgb(0,155,0)";
        if (b.b_mouseover) {
            ctx.fillStyle = "rgb(130,255,0)";
            ctx.strokeStyle = "rgb(150,155,0)";
            ctx.lineWidth = 4;
        }
        else
            ctx.fillStyle = "rgb(100,255,0)";
        
        
        text.font.size = b.fontsize;
        var ds = 0, ks;
        if (b.clicktime > 0) {
            var k = b.clicktime / this.CLICKTIME;
            ks = Math.sin(Math.PI * k);
            ctx.fillStyle = "rgb(100,255," + Math.floor(200 * ks) + ")";
            ds = Math.floor(5 * ks);
            text.font.size = b.fontsize + 2 * ks;
        }

        text.font.b_stroke = false;
        ctx.fillRect(b.x - ds, b.y - ds, b.x1 + 2 * ds, b.y1 + 2 * ds);
        if (b.volume < 1 && ds==0)
        {
            ctx.fillStyle = "rgb(255,255,0)";
             ctx.fillRect(b.x + b.x1*b.volume , b.y , b.x1 *(1-b.volume) , b.y1 );
        }
        
        ctx.strokeRect(b.x - ds, b.y - ds, b.x1 + 2 * ds, b.y1 + 2 * ds);
        
        ctx.lineWidth = 1;
        var yy= text.font.size * 1.2;
        if (!game.b_menu && b.name == 'b3') text.font.color="grey";
       if (typeof b.txt2 === 'undefined') yy=b.y1/2 + text.font.size * 0.4;
        text.render(typeof b.txt == 'string' ? b.txt : b.txt(), b.x + b.x1 / 2, b.y + yy );
        if (typeof b.txt2 !== 'undefined')
        {
            text.render(typeof b.txt2 == 'string' ? b.txt2 : b.txt2(), b.x + b.x1 / 2, b.y + text.font.size * 2.4);
        }

        if (typeof b.tip !== 'undefined' && b.b_mouseover)
        {
            var x, y;
            x = b.x + b.x1;
            y = b.y + b.y1 / 2;

            ctx.strokeStyle = "rgb(180,180,0)";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 90, y - 90);
            ctx.stroke();

            text.font.size = 18;
            text.font.align = "left";
            text.font.color = "rgb(255,255,255)";
            text.renderWrapped(b.tip, x + 110, y - 110, 200, 30);
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
/*    onmousemove: function(x,y) {
        for (var i = 0; i < this.ar_buttons.length; i++)
        {
            var b = this.ar_buttons[i];
            if (typeof b.volume === 'undefined') continue;
            // затычка от сладинга массы вслеленной во время игры
            if (!game.b_menu && b.name == 'b3')
                continue;
            if (x > b.x && x < (b.x + b.x1) && y > b.y & y < (b.y + b.y1)) {
                b.volume = (x - b.x) / b.x1;
                b.action(b.volume);
                return true;
            }
        }
    },*/
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
                if (typeof b.volume === 'undefined') b.clicktime = this.CLICKTIME;
                {
                    if (!game.b_menu && b.name == 'b3')  continue;
                    if (typeof b.volume === 'undefined') continue;
                    b.volume = (x - b.x) / b.x1;
                    b.action(b.volume);
                    return true;
                }
                return true;
            }
        }
    },
    onmousemove: function(x,y) {
        var i, b;
        for (i = 0; i < this.ar_buttons.length; i++)
        {
           this.ar_buttons[i].b_mouseover = false;
        }
        
        for (i = 0; i < this.ar_buttons.length; i++)
        {
            b= this.ar_buttons[i];
            if (x > b.x && x < (b.x+b.x1) && y > b.y & y < (b.y+b.y1)) {
                b.b_mouseover = true;
                if (game.bMouseDown) {
                    if (!game.b_menu && b.name == 'b3')  return true;
                    if (typeof b.volume !== 'undefined') {
                        
                        b.volume = (x - b.x) / b.x1;
                        b.action(b.volume);
                    }
                }
                return true;
            }
            else b.b_mouseover = false;
            
        }        
    }
}

