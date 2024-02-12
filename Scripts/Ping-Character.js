// Ping and center on the player's tokens.
// Version 2.0.0

var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.pingCharacter(msg);
        paraselene.pingCharacterById(msg);
    });
});

paraselene.pingCharacter = function(msg) {
    var commandName = "!Paraselene-Ping-Character";
    if (msg.type != "api" || msg.content.indexOf(commandName) != 0) { return; }

    var playerPageId = Campaign().get("playerpageid");
    var playerPages = Campaign().get("playerspecificpages");
    if (playerPages != false && playerPages.hasOwnProperty(msg.playerid)) {
        playerPageId = playerPages[msg.playerid];
    }

    var playerName = getObj("player", msg.playerid).get("displayname");

    var characterList = [];
    findObjs({ type: "character" }).forEach(character => {
        var controlledBy = character.get("controlledby").split(",");
        if (controlledBy.includes(msg.playerid)) { characterList.push(character); }
    });

    var tokenInfoList = [];
    characterList.forEach(character => {
        findObjs({
            pageid: playerPageId,
            represents: character.get("id"),
            subtype: "token",
            type: "graphic"
        }).forEach(token => {
            tokenInfoList.push({
                characterId: character.get("id"),
                characterName: character.get("name"),
                tokenId: token.get("id")
            });
        });
    });

    if (tokenInfoList.length == 0) {
        sendChat(commandName, `/w "${playerName}" None of your tokens are on this map.`, null, {noarchive: true});
        return;
    }

    if (tokenInfoList.length == 1) {
        token_info = tokenInfoList[0];
        sendChat(
            commandName,
            '!Paraselene-Ping-Character-By-Id ' +
            `${msg.playerid} ${playerPageId} ${token_info.characterId} ${token_info.tokenId}`
        );
        return;
    }

    var links = "";
    tokenInfoList.forEach(token_info => {
        links += '<a href="' +
            '!Paraselene-Ping-Character-By-Id ' +
            `${msg.playerid} ${playerPageId} ${token_info.characterId} ${token_info.tokenId}` +
            `">${token_info.characterName}</a>`;
    });
    sendChat(commandName, `/w "${playerName}" Which character to ping?<br/>${links}`, null, {noarchive: true});
}

paraselene.pingCharacterById = function(msg) {
    var commandName = "!Paraselene-Ping-Character-By-Id";
    if (msg.type != "api" || msg.content.indexOf(commandName) != 0) { return; }
    var args = msg.content.split(/\s+/);

    var playerId = args[1];
    var playerPageId = args[2];
    var characterId = args[3];
    var tokenId = args[4];
    var token = findObjs({
        id: tokenId,
        pageid: playerPageId,
        represents: characterId,
        subtype: "token",
        type: "graphic"
    })[0];
 
    sendPing(token.get("left"), token.get("top"), token.get("pageid"), playerId, true, playerId);
}
