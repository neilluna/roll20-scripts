// Pull a token to a target token.
// Depends on TokenMod.
// Version 1.0.0

var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.pullToken(msg);
    });
});

paraselene.pullToken = function(msg) {
    const commandName = "!Paraselene-Pull-Token";
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    const targetToken = getObj("graphic", msg.selected[0]._id);
    const targetLayer = targetToken.get("layer");

    var playerId = msg.playerid
    var playerName = getObj("player", playerId).get("displayname");

    const tokenList = findObjs({
        pageid: targetToken.get("pageid"),
        subtype: "token",
        type: "graphic",
    });

    if (tokenList.length == 0) {
        sendChat(commandName, `/w "${playerName}" <br/>There are no tokens on this map.`, null, {noarchive: true});
        return;
    }

    const sortedTokenList = tokenList.sort((a, b) => {
        var tokenAName = a.get("name").toLowerCase();
        var tokenBName = b.get("name").toLowerCase();
        return tokenAName < tokenBName ? -1 : (tokenAName > tokenBName ? 1 : 0);
    });

    let links = "";
    sortedTokenList.forEach(token => {
        links += '<a href="' +
            `!token-mod --ignore-selected --ids ${token.get("id")} ` +
            `--order tofront --set layer#${targetLayer} ` +
            `left#${targetToken.get("left")} top#${targetToken.get("top")} ` +
            `">${token.get("name")}</a><br/>`;
    });
    sendChat(commandName, `/w "${playerName}" <br/>Which token to pull?<br/>${links}`, null, {noarchive: true});
}
