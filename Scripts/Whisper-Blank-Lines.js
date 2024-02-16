// Whisper blank lines to the chat window. Non archiving.
// Version 2.0.1

var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.whisperBlankLines(msg);
    });
});

paraselene.whisperBlankLines = function(msg) {
    const commandName = "!Paraselene-Whisper-Blank-Lines";
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    const playerId = msg.playerid
    const playerName = getObj("player", playerId).get("displayname");

    const numberOfBlankLines = Number(args[1])
    const infoMessege = `<br/>${numberOfBlankLines} blank lines. Only you see this. It will not be saved.<br/>`
    const blankLines = Array(numberOfBlankLines + 1).join("<br/>")

    sendChat(commandName, `/w "${playerName}" ${infoMessege}${blankLines}`, null, {noarchive: true});
}
