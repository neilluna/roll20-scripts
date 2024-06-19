// Paraselene-Tools
// Game-independent tools.
// Version 1.1.0

// Github:   https://github.com/neilluna
// By:       Neil Luna
// Contact:  https://app.roll20.net/users/280391/neil-luna

// Register the offset of the start of this script.
// eslint-disable-next-line no-var
var API_Meta = API_Meta || {};
API_Meta.ParaseleneTools = {
    offset: Number.MAX_SAFE_INTEGER,
    lineCount: -1,
    version: '1.1.0',
};
{
    const errorLineNumber = 20;  // Set this to the line number of the "throw new Error('')" below.
    try {
        throw new Error('');  // Set errorLineNumber (above) to this line number.
    }
    catch (exeception) {
        const reportedLineNumber = parseInt(exeception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = reportedLineNumber - errorLineNumber;
        API_Meta.ParaseleneTools.offset = offset;
    }
}

// eslint-disable-next-line no-unused-vars
const ParaseleneTools = (() => {

    const scriptName = 'Paraselene-Tools';
    const version = API_Meta.ParaseleneTools.version;
    const schemaVersion = '1.0.0';
    const scriptAuthor = 'Neil Luna';
 
    // Convenience aliases for ParaseleneCommon.
    let pc = null;
    let Attribute = null;
    let Element = null;
    let Table = null;
    let Row = null;
    let Header = null;
    let Cell = null;
    let Link = null;

    // Log the version info.
    const versionInfo = () => {
        log(`-=> ${scriptName} - ${version} by ${scriptAuthor}`);
    };

    // Check the state schema version. Update the schema if necessary.
    const checkSchema = () => {
        if (!Object.prototype.hasOwnProperty.call(state, scriptName) || state[scriptName].version !== schemaVersion) {
            log(`  > Updating schema to version ${schemaVersion} <`);

            switch (state[scriptName] && state[scriptName].version) {
                case 'UpdateSchemaVersion':
                    state[scriptName].version = schemaVersion;
                    break;

                default:
                    state[scriptName] = {
                        version: schemaVersion,
                    };
                    break;
            }
        }
    };

    // Check if Paraselene-Common is loaded.
    const isParseleneCommonLoaded = () => {
        if (pc !== null) {
            return true;
        }
        if (API_Meta.ParaseleneCommon === undefined) {
            log(`${scriptName}: Error: Paraselene-Common is not loaded.`);
            return false;
        }

        // eslint-disable-next-line no-undef
        pc = ParaseleneCommon;
        const requiredVersion = '1.1.0';
        if (!pc.compareVersions || pc.compareVersions(pc.version, requiredVersion) < 0) {
            log(
                `${scriptName}: Error: Paraselene-Common version ${pc.version} is not supported. ` +
                `Please update Paraselene-Common to version ${requiredVersion} or higher.`,
            );
            pc = null;
            return false;
        }

        // Set up the convenience aliases for ParaseleneCommon.
        Attribute = pc.HtmlAttribute;
        Element = pc.HtmlElement;
        Table = pc.HtmlBorderedTable;
        Row = pc.HtmlBorderedTableRow;
        Header = pc.HtmlBorderedTableHeader;
        Cell = pc.HtmlBorderedTableCell;
        Link = pc.HtmlLink;

        return true;
    };

    // Get information about a token.
    const getTokenInfo = (msg) => {
        const commandName = `${scriptName}-Get-Token-Info`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }

        if (!isParseleneCommonLoaded()) {
            return;
        }

        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);
        const playerId = msg.playerid;
        const tokenId = msg.selected[0]._id;

        sendChat(speakAs, `!${scriptName}-Get-Token-Info-API --speakAs ${speakAs} ${playerId} ${tokenId}`);
    };

    // Get information about a token. Intended to be called from other scripts.
    const getTokenInfoAPI = (msg) => {
        const commandName = `${scriptName}-Get-Token-Info-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }

        if (!isParseleneCommonLoaded()) {
            return;
        }

        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);
        const playerId = args[1];
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');
        const tokenId = args[2];

        const tokens = findObjs({
            id: tokenId,
            subtype: 'token',
            type: 'graphic',
        });

        if (tokens.length == 0) {
            pc.sendChatTokenDoesNotExist(speakAs, playerName);
            return;
        }

        const token = tokens[0];

        const id = token.get('id');
        const name = pc.stringOrBlank(token.get('name'));
        const imgsrc = token.get('imgsrc');
        const represents = pc.stringOrBlank(token.get('represents'));
        const left = Math.round(token.get('left'));
        const top = Math.round(token.get('top'));
        const width = Math.round(token.get('width'));
        const height = Math.round(token.get('height'));
        const rotation = token.get('rotation');
        const layer = token.get('layer');
        const controlledby = pc.stringOrBlank(token.get('controlledby'));

        const cellStyle = 'padding-left: 10px; padding-right: 10px;';
        const table = new Table()
            .add(new Row()
                .add(new Cell(
                    `Information for token<br/>${name}`,
                    'text-align: center;',
                ).addAttribute(new Attribute('colspan', '2'))),
            )
            .add(new Row()
                .add(new Header('id'))
                .add(new Cell(id, cellStyle)),
            )
            .add(new Row()
                .add(new Header('name'))
                .add(new Cell(name, cellStyle)),
            )
            .add(new Row()
                .add(new Header('imgsrc'))
                .add(new Cell(
                    new Element('img')
                        .addAttribute(new Attribute('src', imgsrc))
                        .render() +
                    new Element('br')
                        .render() +
                    new Element('a', imgsrc)
                        .addAttribute(new Attribute('href', imgsrc))
                        .addAttribute(new Attribute('target', '_blank'))
                        .render(),
                    cellStyle,
                )),
            )
            .add(new Row()
                .add(new Header('represents'))
                .add(new Cell(represents, cellStyle)),
            )
            .add(new Row()
                .add(new Header('left'))
                .add(new Cell(left, cellStyle)),
            )
            .add(new Row()
                .add(new Header('top'))
                .add(new Cell(top, cellStyle)),
            )
            .add(new Row()
                .add(new Header('width'))
                .add(new Cell(width, cellStyle)),
            )
            .add(new Row()
                .add(new Header('height'))
                .add(new Cell(height, cellStyle)),
            )
            .add(new Row()
                .add(new Header('rotation'))
                .add(new Cell(rotation, cellStyle)),
            )
            .add(new Row()
                .add(new Header('layer'))
                .add(new Cell(layer, cellStyle)),
            )
            .add(new Row()
                .add(new Header('controlledby'))
                .add(new Cell(controlledby, cellStyle)),
            )
            .add(new Row()
                .add(new Cell(
                    new Link(
                        `!${scriptName}-Delete-Token-API --speakAs ${speakAs} ${playerId} ${id}`,
                        `Delete this token`,
                    ).render(),
                ).addAttribute(new Attribute('colspan', '2'))),
            )
            .add(new Row()
                .add(new Cell(
                    new Link(
                        `!${scriptName}-List-Tokens-API --speakAs ${speakAs} ${playerId} ${id}`,
                        `List other tokens on this token's page`,
                    ).render(),
                ).addAttribute(new Attribute('colspan', '2'))),
            )
            .add(new Row()
                .add(new Cell(
                    new Link(
                        `!${scriptName}-Ping-Token-API --speakAs ${speakAs} ${playerId} ${id}`,
                        `Ping this token and center on its location`,
                    ).render(),
                ).addAttribute(new Attribute('colspan', '2'))),
            )
            .add(new Row()
                .add(new Cell(
                    new Link(
                        `!${scriptName}-List-Pull-Tokens-API --speakAs ${speakAs} ${playerId} ${id}`,
                        `Pull tokens to this token`,
                    ).render(),
                ).addAttribute(new Attribute('colspan', '2'))),
            );

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${table.render()}`);
    };

    // Delete a token. Meant to be called from other scripts.
    const deleteTokenAPI = (msg) => {
        const commandName = `${scriptName}-Delete-Token-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }

        if (!isParseleneCommonLoaded()) {
            return;
        }

        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);
        const playerId = args[1];
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');
        const tokenId = args[2];

        const tokens = findObjs({
            id: tokenId,
            subtype: 'token',
            type: 'graphic',
        });

        if (tokens.length == 0) {
            pc.sendChatTokenDoesNotExist(speakAs, playerName);
            return;
        }

        const token = tokens[0];
        const id = token.get('id');
        const name = pc.stringOrBlank(token.get('name'));

        token.remove();

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>Token "${name}" (${id}) deleted.`);
    };

    // List all tokens on the same page. Meant to be called from other scripts.
    const listTokensAPI = (msg) => {
        const commandName = `${scriptName}-List-Tokens-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }

        if (!isParseleneCommonLoaded()) {
            return;
        }

        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);
        const playerId = args[1];
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');
        const tokenId = args[2];

        const specifiedTokens = findObjs({
            id: tokenId,
            subtype: 'token',
            type: 'graphic',
        });

        if (specifiedTokens.length == 0) {
            pc.sendChatTokenDoesNotExist(speakAs, playerName);
            return;
        }

        const token = specifiedTokens[0];
        const tokenName = pc.stringOrBlank(token.get('name'));
        const pageId = token.get('pageid');

        let pageTokens = findObjs({
            pageid: pageId,
            subtype: 'token',
            type: 'graphic',
        });

        if (pageTokens.length > 1) {
            pageTokens = pc.sortTokens(pageTokens);
        }

        const pageTokensTable = new Table()
            .add(new Row()
                .add(new Cell(
                    `Tokens on the same page as<br/>"${tokenName}"<br/>(${tokenId})`,
                    'text-align: center;',
                ).addAttribute(new Attribute('colspan', '2'))),
            )
            .add(new Row()
                .add(new Header('Token'))
                .add(new Header(
                    'left,&nbsp;top,&nbsp;width,&nbsp;height',
                    'padding-left: 10px; padding-right: 10px;',
                )),
            );
        pageTokens.forEach(token => {
            const id = token.get('id');
            const name = pc.stringOrBlank(token.get('name'));
            const left = Math.round(token.get('left'));
            const top = Math.round(token.get('top'));
            const width = Math.round(token.get('width'));
            const height = Math.round(token.get('height'));

            pageTokensTable
                .add(new Row()
                    .add(new Cell(
                        new Link(`!${scriptName}-Get-Token-Info-API --speakAs ${speakAs} ${playerId} ${id}`, name)
                            .render(),
                    ))
                    .add(new Cell(
                        `${left},&nbsp;${top},&nbsp;${width},&nbsp;${height}`,
                        'padding-left: 10px; padding-right: 10px;',
                    )),
                );
        });

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${pageTokensTable.render()}`);
    };

    // Present a menu allowing a player to ping and center a token that they control.
    const pingCharacter = (msg) => {
        const commandName = `${scriptName}-Ping-Character`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }

        if (!isParseleneCommonLoaded()) {
            return;
        }

        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);
        const playerId = msg.playerid;
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');
        const playerPageId = pc.getPlayerPageId(playerId);

        if (playerIsGM(playerId)) {
            const message = 'GMs cannot use Ping-Character. Use Get-Token-Info instead.';
            pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${message}`);
            return;
        }

        const characters = findObjs({
            type: 'character',
        }).filter(character => {
            const controlledBy = character.get('controlledby').split(',');
            const inplayerjournals = character.get('inplayerjournals').split(',');

            const isControlledBy = controlledBy.includes(playerId) || controlledBy.includes('all');
            const isInPlayerJournals = inplayerjournals.includes(playerId) || inplayerjournals.includes('all');

            return isControlledBy && isInPlayerJournals;
        });

        let tokens = [];
        characters.forEach(character => {
            const characterId = character.get('id');
            findObjs({
                pageid: playerPageId,
                layer: 'objects',
                represents: characterId,
                subtype: 'token',
                type: 'graphic',
            }).forEach(token => {
                tokens.push(token);
            });
        });

        if (tokens.length == 0) {
            pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>None of your tokens are on this map.`);
            return;
        }

        if (tokens.length == 1) {
            const token = tokens[0];
            const id = token.get('id');
            sendChat(speakAs, `!${scriptName}-Ping-Token-API --speakAs ${speakAs} ${playerId} ${id}`);
            return;
        }
    
        if (tokens.length > 1) {
            tokens = pc.sortTokens(tokens);
        }

        const pageTokensTable = new Table()
            .add(new Row()
                .add(new Header('Token'))
                .add(new Header(
                    'left,&nbsp;top,&nbsp;width,&nbsp;height',
                    'padding-left: 10px; padding-right: 10px;',
                )),
            );
        tokens.forEach(token => {
            const id = token.get('id');
            const name = pc.stringOrBlank(token.get('name'));
            const left = Math.round(token.get('left'));
            const top = Math.round(token.get('top'));
            const width = Math.round(token.get('width'));
            const height = Math.round(token.get('height'));

            pageTokensTable
                .add(new Row()
                    .add(new Cell(
                        new Link(`!${scriptName}-Ping-Token-API --speakAs ${speakAs} ${playerId} ${id}`, name)
                            .render(),
                    ))
                .add(
                    new pc.HtmlTableCell(
                        `${left},&nbsp;${top},&nbsp;${width},&nbsp;${height}`,
                        'padding-left: 10px; padding-right: 10px;',
                    ),
                ),
            );
        });

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${pageTokensTable.render()}`);
    };

    // Ping and center a token.
    const pingTokenAPI = (msg) => {
        const commandName = `${scriptName}-Ping-Token-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }

        if (!isParseleneCommonLoaded()) {
            return;
        }

        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);
        const playerId = args[1];
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');
        const tokenId = args[2];

        const tokens = findObjs({
            id: tokenId,
            subtype: 'token',
            type: 'graphic',
        });

        if (tokens.length == 0) {
            pc.sendChatTokenNotOnPage(speakAs, playerName);
            return;
        }

        const token = tokens[0];
        const name = pc.stringOrBlank(token.get('name'));
        const left = token.get('left');
        const top = token.get('top');
        const pageId = token.get('pageid');

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>Pinging token ${name} ...`);
        sendPing(left, top, pageId, playerId, true, playerId);
    };

    // Present a menu allowing a player to pull other tokens on the same page to this token.
    const listPullTokensAPI = (msg) => {
        const commandName = `${scriptName}-List-Pull-Tokens-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }

        if (!isParseleneCommonLoaded()) {
            return;
        }

        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);
        const playerId = args[1];
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');
        const tokenId = args[2];

        const specifiedTokens = findObjs({
            id: tokenId,
            subtype: 'token',
            type: 'graphic',
        });

        if (specifiedTokens.length == 0) {
            pc.sendChatTokenDoesNotExist(speakAs, playerName);
            return;
        }

        const token = specifiedTokens[0];
        const tokenName = pc.stringOrBlank(token.get('name'));
        const pageId = token.get('pageid');
        const tokenLayer = token.get('layer');
        const tokenLeft = token.get('left');
        const tokenTop = token.get('top');

        let pageTokens = findObjs({
            pageid: pageId,
            subtype: 'token',
            type: 'graphic',
        });

        if (pageTokens.length > 1) {
            pageTokens = pc.sortTokens(pageTokens);
        }

        const pageTokensTable = new Table()
            .add(new Row()
                .add(new Cell(
                    `Tokens on the same page as<br/>"${tokenName}"<br/>(${tokenId})<br/>` +
                    'Which token do you wish to pull to this token?',
                    'text-align: center;',
                ).addAttribute(new Attribute('colspan', '2'))),
            )
            .add(new Row()
                .add(new Header('Token'))
                .add(new Header(
                    'left,&nbsp;top,&nbsp;width,&nbsp;height',
                    'padding-left: 10px; padding-right: 10px;',
                )),
            );
        pageTokens.forEach(token => {
            const id = token.get('id');
            const name = pc.stringOrBlank(token.get('name'));
            const left = Math.round(token.get('left'));
            const top = Math.round(token.get('top'));
            const width = Math.round(token.get('width'));
            const height = Math.round(token.get('height'));

            pageTokensTable
                .add(new Row()
                    .add(new Cell(
                        new Link(
                            `!token-mod --ignore-selected --ids ${id} ` +
                                `--order tofront --set layer#${tokenLayer} ` +
                                `left#${tokenLeft} top#${tokenTop}`,
                            name,
                        ).render(),
                    ))
                    .add(new Cell(
                        `${left},&nbsp;${top},&nbsp;${width},&nbsp;${height}`,
                        'padding-left: 10px; padding-right: 10px;',
                    )),
                );
        });

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${pageTokensTable.render()}`);
    };

    // Rotate a token to the next 45-degree increment.
    const rotateToken = (msg) => {
        const commandName = `${scriptName}-Rotate-Token`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const token = findObjs({
            id: msg.selected[0]._id,
            subtype: 'token',
            type: 'graphic',
        })[0];

        let newRotation = Math.ceil((token.get('rotation') + 45) / 45) * 45;
        if (newRotation >= 360) {
            newRotation -= 360;
        }
        token.set("rotation", newRotation);
    };

    // Register event handlers.
    const registerEventHandlers = () => {
        on('chat:message', deleteTokenAPI);
        on('chat:message', getTokenInfo);
        on('chat:message', getTokenInfoAPI);
        on('chat:message', listTokensAPI);
        on('chat:message', pingCharacter);
        on('chat:message', pingTokenAPI);
        on('chat:message', listPullTokensAPI);
        on('chat:message', rotateToken);
    };

    // When all scripts have loaded ...
    on('ready', () => {
        versionInfo();
        checkSchema();
        registerEventHandlers();
    });

    // Public interface.
    return {
        version: version,
    };

})();  // ParaseleneTools

// Register the length of this script.
{
    // Set this to the number of lines following the "throw new Error('')" below.
    const numberOfLinesFromErrorToScriptEnd = 9;
    try {
        throw new Error('');  // Set numberOfLinesFromErrorToScriptEnd to the number of lines following this line.
    }
    catch (exception) {
        const reportedLineNumber = parseInt(exception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = API_Meta.ParaseleneTools.offset;
        const lineCount = reportedLineNumber - offset + numberOfLinesFromErrorToScriptEnd;
        API_Meta.ParaseleneTools.lineCount = lineCount;
    }
}
