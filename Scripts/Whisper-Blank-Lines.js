// Whisper blank lines to the chat window. Non archiving.
// Version 2.0.1

var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.whisperBlankLines(msg);
    });
});

paraselene.whisperBlankLines = function(msg) {
    var commandName = "!Paraselene-Whisper-Blank-Lines";
    var args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    var playerName = getObj("player", msg.playerid).get("displayname");

    var numberOfBlankLines = Number(args[1])
    var infoMessege = `<br/>${numberOfBlankLines} blank lines. Only you see this. It will not be saved.<br/>`
    var blankLines = Array(numberOfBlankLines + 1).join("<br/>")

    sendChat(commandName, `/w "${playerName}" ${infoMessege}${blankLines}`, null, {noarchive: true});
}
