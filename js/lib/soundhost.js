/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var soundhost = {
    ar_sounds : [],
    num2load: 0,
    numloaded: 0,
    path: 'res/sound/',
    Load : function(name)
    {
        this.num2load++;
        var that = this;
        var snd = new Howl({
            urls: [ this.path + name + '.ogg', this.path + name + '.mp3'],
            onload: function()
            {
                that.num2load--;
                that.numloaded++;
            }
        });
        snd.name = name;
        
        this.ar_sounds.push(snd);
        return snd;
    },
    get: function(name)
    {
        var i;
        for (i = 0; i < this.ar_sounds.length; i++)
        {
            if (this.ar_sounds[i].name == name)
            {
                return this.ar_sounds[i];
            }

        }
    }
}