// Whisper blank lines to the chat window. Non archiving.
// Version 1.0.0-dev

on("chat:message", function(msg) {
    var commandName = "!Whisper-Blank-Lines";

    var args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != commandName) { return; }

    var playerName = getObj("player", msg.playerid).get("displayname");

    var numberOfBlankLines = Number(args[1])
    var infoMessege = `${numberOfBlankLines} blank lines. Only you see this. It will not be archived.`
    var blankLines = Array(numberOfBlankLines + 1).join("<br>")

    sendChat(commandName, `/w "${playerName}" <br>${infoMessege}<br>${blankLines}`, null, {noarchive: true});
});
