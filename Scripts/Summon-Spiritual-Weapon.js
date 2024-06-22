// Summon a Spiritual Weapon
// Version 3.0.1

// eslint-disable-next-line no-var
var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.summonSpiritualWeapon(msg);
    });
});

paraselene.summonSpiritualWeapon = function(msg) {
    const commandName = "!Paraselene-Summon-Spiritual-Weapon";
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    const weapon = JSON.parse(args[1]);
    const offset = args[2];

    // if (!msg.selected || (msg.selected.length == 0)) {
    //     pc.whisperTokenNotSelected(speakAs, playerName);
    //     return;
    // }

    const token = getObj("graphic", msg.selected[0]._id);
    const character = getObj("character", token.get("represents"));

    let left = token.get("left");
    let top = token.get("top");

    switch (offset) {
        case "Above":
            top -= 70;
            break;
        case "Below":
            top += 70;
            break;
        case "Left":
            left -= 70;
            break;
        case "Right":
            left += 70;
            break;
    };

    spawnFx(left, top, "burst-holy", token.get("pageid"));

    createObj("graphic", {
        controlledby: character.get("controlledby"),
        height: 70,
        imgsrc: weapon.url,
        layer: "objects",
        left: left,
        name: `${token.get("name").split(/(\s+)/)[0]}'s Spiritual ${weapon.name}`,
        pageid: token.get("pageid"),
        showname: true,
        showplayers_name: true,
        top: top,
        width: 70,
    });
};
