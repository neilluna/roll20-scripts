// Ping and center on the player's tokens.
// Version 2.0.2

var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.pingCharacter(msg);
        paraselene.pingCharacterById(msg);
    });
});

paraselene.pingCharacter = function(msg) {
    const commandName = "!Paraselene-Ping-Character";
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    const playerId = msg.playerid
    const playerName = getObj("player", playerId).get("displayname");

    let playerPageId = Campaign().get("playerpageid");
    const playerPages = Campaign().get("playerspecificpages");
    if (playerPages != false && playerPages.hasOwnProperty(playerId)) {
        playerPageId = playerPages[playerId];
    }

    const characterList = findObjs({type: "character"}).filter(character => {
        const controlledBy = character.get("controlledby").split(",");
        return controlledBy.includes(playerId) || controlledBy.includes("all");
    });

    let tokenInfoList = [];
    characterList.forEach(character => {
        findObjs({
            pageid: playerPageId,
            represents: character.get("id"),
            subtype: "token",
            type: "graphic",
        }).forEach(token => {
            tokenInfoList.push({
                tokenId: token.get("id"),
                tokenName: token.get("name"),
            });
        });
    });

    if (tokenInfoList.length == 0) {
        sendChat(commandName, `/w "${playerName}" <br/>None of your tokens are on this map.`, null, {noarchive: true});
        return;
    }

    if (tokenInfoList.length == 1) {
        sendChat(
            commandName,
            '!Paraselene-Ping-Character-By-Id ' +
            `${playerId} ${playerName} ${tokenInfoList[0].tokenId}`
        );
        return;
    }

    tokenInfoList = tokenInfoList.sort((token1, token2) => {
        const name1 = token1.tokenName.toLowerCase();
        const name2 = token2.tokenName.toLowerCase();
        return name1 < name2 ? -1 : (name1 > name2 ? 1 : 0);
    });

    let links = "";
    tokenInfoList.forEach(token_info => {
        links += '<a href="' +
            '!Paraselene-Ping-Character-By-Id ' +
            `${playerId} ${playerName} ${token_info.tokenId}` +
            `">${token_info.tokenName}</a><br/>`;
    });
    sendChat(commandName, `/w "${playerName}" <br/>Which character to ping?<br/>${links}`, null, {noarchive: true});
}

paraselene.pingCharacterById = function(msg) {
    const commandName = "!Paraselene-Ping-Character-By-Id";
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    const playerId = args[1];
    const playerName = args[2];
    const tokenId = args[3];

    var tokenList = findObjs({
        id: tokenId,
        subtype: "token",
        type: "graphic",
    });

    if (tokenList.length == 0) {
        sendChat(commandName, `/w "${playerName}" <br/>The token is no longer on this map.`, null, {noarchive: true});
        return;
    }

    const token = tokenList[0];
    sendPing(token.get("left"), token.get("top"), token.get("pageid"), playerId, true, playerId);
}
