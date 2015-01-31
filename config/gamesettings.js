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
    intro: "Start a big bang.",
    addenemies: "У врага пополнение!",        
    b_events: [0,0,0,0,0],
    events: [ 
    "Правительство заметило нездоровую активность. Бдительность войск усилена.",
    "Правительство провело призыв новых солдат",
    "Мировая общественность обеспокоена количеством трупов. Правительство обещает подавить восстание",
    "Правительство перевооружает армию более современным оружием",
    "Правительство призвало почти всех военнообязаных граждан. Весь бюджет страны потрачен на оснащение армии",
    ]
            
};