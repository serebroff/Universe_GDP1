

//-------------------------------------------------------
// Base class for multi-player
//-------------------------------------------------------

/*
 *  List of Events
 *  0: Send World Map and Units 

 */

var NETWORK_WORKS = true;
var multiplayer;

Multiplayer = function () {

    this.MyPlayerID =0;
    // is the player host?
    this.host = false;
    this.b_initialized = false;

    
    this.b_InGame = false;

    this.b_startPvP = false;
    this.b_waitingOpponent = false;
    this.b_connectingOpponent = false;
    
    this.numPlayersOnline = 0;
    this.numPlayersReadyToPlay = 0;
    
    this.opponentSeed =0;
 
};

Multiplayer.prototype.Load = function () {
    if (!NETWORK_WORKS) return;
    this.LBC = new Photon.LoadBalancing.LoadBalancingClient("app.exitgamescloud.com:9090", "45929a8b-675d-4835-b836-7ea55e491455", "1.0");
    this.LBC.onRoomList = this.onRoomList;
    this.LBC.onRoomListUpdate = this.onRoomListUpdate;
    this.LBC.onActorJoin = this.onActorJoin;
    this.LBC.onActorLeave = this.onActorLeave;
    this.LBC.onEvent = this.onEvent;
    this.LBC.onJoinRoom = this.onJoinRoom;

    this.LBC.connect(true);
  // this.peer = new Photon.Lite.LitePeer("app.exitgamescloud.com:9090");
  // this.peer.join("room1");
  
 //   var world_str = game.world.GetWorldAsString();
 
    setInterval(function() { multiplayer.Calculate(); }, 1000);
};

Multiplayer.prototype.Reconnect = function () {
    if (!NETWORK_WORKS) return;
    this.b_initialized = false;
    devlog.add("RECONNECT to server");
    this.LBC.connect(true);
}

Multiplayer.prototype.SendEvent = function (code, data) {
    if (!NETWORK_WORKS) return;
    if (!this.b_initialized) return;
    if (!game.b_PvP) return;

    if (this.LBC.isJoinedToRoom())
    {
        this.LBC.raiseEvent(code, { "data":data, "seed" : rnd.getrandpos()} );
    } 
    else
    {
        this.Reconnect();
    }
}

Multiplayer.prototype.EnterLobby = function () {
    this.b_waitingOpponent = false;
    this.b_connectingOpponent = false;
    this.b_startPvP = false;
    this.LBC.leaveRoom();
}

Multiplayer.prototype.EnterGame = function () {
    this.b_waitingOpponent = false;
    this.b_connectingOpponent = false;
    this.b_startPvP = false;
    this.b_InGame = true;
}

Multiplayer.prototype.Calculate = function () {
    
    if (!this.b_initialized) return;
    
    var b_lobby = this.LBC.isInLobby();
    var b_inroom = this.LBC.isJoinedToRoom();
    
    if (!this.LBC.isConnectedToMaster())
    {
        devlog.add("Connection to Master lost");
        this.Reconnect();
        return;
    }
    
    // if we are in lobby, but not joined 'ReadyToPlay" room
    // then - join it
    if (!this.b_startPvP && b_lobby && !b_inroom &&
            !this.b_connectingOpponent && !this.b_waitingOpponent)
    {
        this.LBC.createRoom("ReadyToPlay");
        // join lobby if it exist
        this.LBC.joinRoom("ReadyToPlay");
    }
    
    // starting PVP match
    if (this.b_startPvP && b_lobby && !b_inroom)
    {
        var b_joined = false;

        var rooms = this.LBC.availableRooms();
        
        // try to join existing game
        for (var i=rooms.length -1; i>= 0; i--)
        {
           //if (rooms[i].name == "ReadyToPlay") continue;
            if (rooms[i].playerCount == 1 &&  rooms[i].getCustomProperty("fresh") == 'true')
            { // connecting to 
                this.LBC.joinRoom(rooms[i].name);
                b_joined = true;
                
                // enter game room, wating for world data
                devlog.add("connecting Opponent...");
                this.b_connectingOpponent = true;
               // break;
            }
        }
        
        // new game
        if (!b_joined)
        {
            var str = "room" + rooms.length;
            this.LBC.createRoom(str, true, true, 2, { 'fresh':'true' } );
            this.LBC.joinRoom(str);
            
            // game has been created,  wating for the opponent
            devlog.add("waiting Opponent...");
            this.b_waitingOpponent = true;
        }
        this.b_startPvP = false;
    }
};

Multiplayer.prototype.StartPvP = function()
{ 
    var b_lobby = this.LBC.isInLobby();
    var b_inroom = this.LBC.isJoinedToRoom();
    
    if (!this.b_startPvP && !this.b_connectingOpponent && !this.b_waitingOpponent)
    {
        this.LBC.leaveRoom();
        this.b_startPvP = true;
    } 
    else
    {
          // join lobby if it exist
        if (b_inroom) this.LBC.leaveRoom();
        //this.LBC.joinRoom("ReadyToPlay");
        this.b_startPvP = false; 
        this.b_connectingOpponent =false;
        this.b_waitingOpponent = false;
    }
      
}

Multiplayer.prototype.StartAI = function()
{
    this.b_initialized = false;
    lobby.StartGameVsAI();
}


//------------------------------------------------
// multiplayer callbacks 
// "this." doesn't work here, use "multiplayer." instead
//------------------------------------------------

Multiplayer.prototype.onRoomList = function(rooms)
{

    multiplayer.numPlayersOnline = 1;
    multiplayer.numPlayersReadyToPlay =1;
    
    var b_lobbyexist =false;
    
    multiplayer.rooms = rooms;
    
    // check if first Lobby room exist
    for (var i=0; i< rooms.length; i++)
    {
        multiplayer.numPlayersOnline += rooms[i].playerCount;        
        if (rooms[i].name == "ReadyToPlay") {
            multiplayer.numPlayersReadyToPlay += rooms[i].playerCount;
            b_lobbyexist = true;
        } 
        else
        {
            if (rooms[i].playerCount == 1) multiplayer.numPlayersReadyToPlay++;
        }
    } 
    
    // create lobby if it's not exist
    if (!b_lobbyexist)
    {
        this.createRoom("ReadyToPlay");
    }
    
    // join lobby if it exist
    this.joinRoom("ReadyToPlay");
    
    multiplayer.b_initialized = true;


};

Multiplayer.prototype.onRoomListUpdate = function(rooms, roomsUpdated, roomsAdded, roomsRemoved)
{
    if (!multiplayer.b_initialized) return;
    
    devlog.add("onRoomListUpdate, num: " + rooms.length + ", updated: " +roomsUpdated.length + ", added: " + roomsAdded.length + ", removed:" + roomsRemoved.length  );

    multiplayer.numPlayersOnline = 0;
    multiplayer.numPlayersReadyToPlay = 0;
    for (var i=0; i< rooms.length; i++)
    {
        multiplayer.numPlayersOnline += rooms[i].playerCount;
        if (rooms[i].name == "ReadyToPlay") {
            multiplayer.numPlayersReadyToPlay += rooms[i].playerCount;
        } else
        {
            if (rooms[i].playerCount == 1)   multiplayer.numPlayersReadyToPlay++;
        }
    } 


}


Multiplayer.prototype.onJoinRoom = function()
{
    var actor = this.myActor();
    var room = this.myRoom();
    devlog.add("I, " + actor.actorNr + ", join room " + room.name);
}


Multiplayer.prototype.onActorJoin = function(actor)
{

    //game.players.AddPlayer(actor.actorNr);
    var room= this.myRoom();
    
    devlog.add( "Actor " + actor.actorNr +" joined "+ room.name );
    if (multiplayer.b_waitingOpponent)
    {
        room.setCustomProperty('fresh', 'false');
        lobby.StartGameAsHost();
    }

   
}   

Multiplayer.prototype.onActorLeave = function(actor)
{
    var room= this.myRoom();
    //game.players.RemovePlayer(actor.actorNr);
    if (room.name != "ReadyToPlay")
    {
        if (multiplayer.b_InGame) game.OpponentLeave();
    }
    devlog.add( "Actor " + actor.actorNr +" leaved " + room.name );

}



Multiplayer.prototype.onEvent = function(code, content, actorNr)
{
    if (!multiplayer.b_initialized) return;
    
    if (typeof content == 'undefined' || content.seed == 'undefined') return;
    
    multiplayer.opponentSeed = content.seed;
    var data = content.data;
    
    switch(code)
    {
    case 0: // world came
        lobby.StartGameAsReceiver(data);
        break;
        
    case 1: // Next Turn
        game.NextTurn();
        break;
    
     case 2: // Goto (x,y) by enemy unit
        game.mobs.GotoByOpponent(data.unitIndex, data.x,data.y);
        break; 
        
     case 3: // Shoot (x,y) by enemy unit
        game.mobs.ShootByOpponent(data.unitIndex, data.x,data.y);
        break;         
        
     case 4: // Select mob (index)
        game.mobs.SelectMobByOpponent(data);
        break;     
        
    }
}




