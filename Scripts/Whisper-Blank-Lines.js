// Whisper blank lines to the chat window. Non archiving.
// Version 2.0.0

var paraselene = paraselene || {};

on("ready", function() {
    on("chat:message", function(msg) {
        paraselene.whisperBlankLines(msg);
    });
});

paraselene.whisperBlankLines = function(msg) {
    var commandName = "!Paraselene-Whisper-Blank-Lines";
    if (msg.type != "api" || msg.content.indexOf(commandName) != 0) { return; }
    var args = msg.content.split(/\s+/);

    var playerName = getObj("player", msg.playerid).get("displayname");

    var numberOfBlankLines = Number(args[1])
    var infoMessege = `${numberOfBlankLines} blank lines. Only you see this. It will not be archived.`
    var blankLines = Array(numberOfBlankLines + 1).join("<br>")

    sendChat(commandName, `/w "${playerName}" <br>${infoMessege}<br>${blankLines}`, null, {noarchive: true});
}
