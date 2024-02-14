// Ping and center on the player's tokens.
// Version 2.0.1

var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.pingCharacter(msg);
        paraselene.pingCharacterById(msg);
    });
});

paraselene.pingCharacter = function(msg) {
    var commandName = "!Paraselene-Ping-Character";
    var args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

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
        sendChat(commandName, `/w "${playerName}" <br/>None of your tokens are on this map.`, null, {noarchive: true});
        return;
    }

    if (tokenInfoList.length == 1) {
        token_info = tokenInfoList[0];
        sendChat(
            commandName,
            '!Paraselene-Ping-Character-By-Id ' +
            `${msg.playerid} ${playerName} ${playerPageId} ${token_info.characterId} ${token_info.tokenId}`
        );
        return;
    }

    var links = "";
    tokenInfoList.forEach(token_info => {
        links += '<a href="' +
            '!Paraselene-Ping-Character-By-Id ' +
            `${msg.playerid} ${playerName} ${playerPageId} ${token_info.characterId} ${token_info.tokenId}` +
            `">${token_info.characterName}</a><br/>`;
    });
    sendChat(commandName, `/w "${playerName}" <br/>Which character to ping?<br/>${links}`, null, {noarchive: true});
}

paraselene.pingCharacterById = function(msg) {
    var commandName = "!Paraselene-Ping-Character-By-Id";
    var args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    var playerId = args[1];
    var playerName = args[2];
    var playerPageId = args[3];
    var characterId = args[4];
    var tokenId = args[5];
    var tokenList = findObjs({
        id: tokenId,
        pageid: playerPageId,
        represents: characterId,
        subtype: "token",
        type: "graphic"
    });

    if (tokenList.length == 0) {
        sendChat(commandName, `/w "${playerName}" <br/>The token is no longer on this map.`, null, {noarchive: true});
        return;
    }

    var token = tokenList[0];
    sendPing(token.get("left"), token.get("top"), token.get("pageid"), playerId, true, playerId);
}
