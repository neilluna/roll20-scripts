// Summon a Spiritual Weapon
// Version 1.0.8

on("ready", function() {
    on("chat:message", function(msg) {
        var commandName = "!Summon-Spiritual-Weapon";

        var args = msg.content.split(/\s+/);
        if (msg.type != "api" || args[0] != commandName) { return; }
    
        var playerName = getObj("player", msg.playerid).get("displayname");

        // Default weapon.
        var weapon = "hammer";
        var imageSrc = "url-to-your-hammer-spiritual-weapon";

        var xOffset = 0;
        var yOffset = 0;

        args.forEach(arg => {
            if (arg == commandName) { return; }
            switch (arg) {
                case "above":
                    yOffset = -70;
                    break;
                case "arrow":
                    imageSrc = "url-to-your-arrow-spiritual-weapon";
                    break;
                case "axe":
                    imageSrc = "url-to-your-axe-spiritual-weapon";
                    break;
                case "below":
                    yOffset = 70;
                    break;
                case "bow":
                    imageSrc = "url-to-your-bow-spiritual-weapon";
                    break;
                case "club":
                    imageSrc = "url-to-your-club-spiritual-weapon";
                    break;
                case "hammer":
                    imageSrc = "url-to-your-hammer-spiritual-weapon";
                    break;
                case "left":
                    xOffset = -70;
                    break;
                case "mace":
                    imageSrc = "url-to-your-mace-spiritual-weapon";
                    break;
                case "right":
                    xOffset = 70;
                    break;
                case "spear":
                    imageSrc = "url-to-your-spear-spiritual-weapon";
                    break;
                case "sword":
                    imageSrc = "url-to-your-sword-spiritual-weapon";
                    break;
            }
        });

        var selected = msg.selected;
        if (selected === undefined) {
            sendChat(commandName, `/w "${playerName}" No token selected.`, null, {noarchive: true});
            return;
        }
        var token = getObj("graphic", selected[0]._id);
        var character = getObj("character", token.get("represents"));
        var playerList = character.get("controlledby");
        
        var x = token.get("left") + xOffset;
        var y = token.get("top") + yOffset;

        spawnFx(x, y, "burst-holy", token.get("pageid"));

        var name = token.get("name").split(/(\s+)/)[0] +
            `'s Spiritual ${weapon.charAt(0).toUpperCase()}${weapon.substring(1).toLowerCase()}`;

        object = createObj("graphic", {
            controlledby: playerList,
            height: 70,
            imgsrc: imageSrc,
            layer: "objects",
            left: x,
            name: name,
            pageid: token.get("pageid"),
            showname: true,
            showplayers_name: true,
            top: y,
            width: 70
        });
    });
});
