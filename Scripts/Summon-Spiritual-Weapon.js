// Summon a Spiritual Weapon
// Version 2.0.9

on("ready", function() {
    on("chat:message", function(msg) {
        var commandName = "!Summon-Spiritual-Weapon";

        var args = msg.content.split(/\s+/);
        if (msg.type != "api" || args[0] != commandName) { return; }
    
        var playerName = getObj("player", msg.playerid).get("displayname");

        var weapon = JSON.parse(args[1]);
        var offset = args[2];

        var xOffset = 0;
        var yOffset = 0;

        switch (offset) {
            case "Above":
                yOffset = -70;
                break;
            case "Below":
                yOffset = 70;
                break;
            case "Left":
                xOffset = -70;
                break;
            case "Right":
                xOffset = 70;
                break;
        };

        var selected = msg.selected;
        var token = getObj("graphic", selected[0]._id);
        var character = getObj("character", token.get("represents"));
        
        var x = token.get("left") + xOffset;
        var y = token.get("top") + yOffset;

        spawnFx(x, y, "burst-holy", token.get("pageid"));

        object = createObj("graphic", {
            controlledby: character.get("controlledby"),
            height: 70,
            imgsrc: weapon.url,
            layer: "objects",
            left: x,
            name: `${token.get("name").split(/(\s+)/)[0]}'s Spiritual ${weapon.name}`,
            pageid: token.get("pageid"),
            showname: true,
            showplayers_name: true,
            top: y,
            width: 70
        });
    });
});
