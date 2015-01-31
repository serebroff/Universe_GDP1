/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var texturehost = {
    ar_textures : [],
    num2load: 0,
    numloaded: 0,
    Load : function(name)
    {
        var i;
        for (i = 0; i < this.ar_textures.length; i++)
        {   // if texture already exists
            if (name == this.ar_textures[i].src)
            {
                return this.ar_textures[i];
            }
        }
        
        this.num2load++;
        var img = new Image();
        img.src = name;
        var that = this;
        img.onload = function()
        {
            that.num2load--;
            that.numloaded ++;
        }
        this.ar_textures.push(img);
        return img;
    }
}
