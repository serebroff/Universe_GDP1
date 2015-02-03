var revdata = 
{
    "day":0,
    "coins":100,
    
    // revs
    "PR":50,
    "ATK":50,
    "SPD":1,
    "VISION": 1100,
    "PRlvl":0,
    "ATKlvl":0,
    
    "cityEnemy": 400,
    "cityRevs": 0,
    
    // enemies
    "enemyATK":300,
    "enemyPR":0,
    "enemySPD":1,
    "ENEMY_VISION":1100,
    
    
    "ATKradius": 100,
    
    // common data
    "units_in_squad": 10,
    "population": 10000,
    "enemies": 500, // contra, pro-gorment forces
    "revs": 10, // revolutionaires 
    "dead":0, // dead people
};
    
var capital = {
    name: "Capital",
    x: 0,
    y: 0,
    r: 18,
    r2: 22
}    
    
var upgrades = 
{
    "PR":[
        {"cost":100, "raise": 100 },
        {"cost":250, "raise": 150 },
        {"cost":400, "raise": 250 },
        {"cost":500, "raise": 300 }
    ],
    "ATK":[
       {"cost":100, "raise": 50 },
       {"cost":200, "raise": 150 },
       {"cost":300, "raise": 250 },
       {"cost":400, "raise": 350 },
    ],
};
    
var levels = [
    {
        'numenemies': 1,
        'population': 30000000
    }
];

var gametexts = {
    intro: "This is the Universe before Big Bang",// Use mouse (drag and wheel) to navigate",
    copyright: "By Alexey Serebrov special for GameGevParty #1 / 2015",        
    mouse: "Use mouse left button to navigate and wheel to zoom",
    slogan:[
    "This game has no goal",
    "Beaty of nature is the only reason",
    "Are you the Creator, arn't you?",
    "Nice try!",
    ],
    h:
    [
        "Speed limit of an object in the Universe",
         "Gravitational force that attracts all objects to each other",
         "Also number of objects. Set up only before Big Bang. (It can slow down FPS!)",
    ],
            
};