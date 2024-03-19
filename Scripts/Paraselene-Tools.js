// Paraselene-Tools
// Game-independent tools.
// Version 1.0.0

// Github:   https://github.com/neilluna
// By:       Neil Luna
// Contact:  https://app.roll20.net/users/280391/neil-luna

// Register the offset of the start of this script.
var API_Meta = API_Meta || {};
API_Meta.ParaseleneTools = {
    offset: Number.MAX_SAFE_INTEGER,
    lineCount: -1,
    version: '1.0.0',
};
{
    const errorLineNumber = 19;  // Set this to the line number of the "throw new Error('')" below.
    try {
        throw new Error('');  // Set errorLineNumber (above) to this line number.
    }
    catch (exeception) {
        const reportedLineNumber = parseInt(exeception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = reportedLineNumber - errorLineNumber;
        API_Meta.ParaseleneTools.offset = offset;
    }
}

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
        log(`-=> ${scriptName} - ${version} by ${scriptAuthor} <=- Meta offset: ${API_Meta.ParaseleneTools.offset}`);
    };

    // Check the schema version and update if necessary.
    const checkSchema = () => {
        if (!state.hasOwnProperty(scriptName) || state[scriptName].version !== schemaVersion) {
            log(`  > Updating schema to version ${schemaVersion} <`);

            switch (state[scriptName] && state[scriptName].version) {
                case '1.0.0':
                    // No break statement. This must fall through.

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
            sendChat(speakAs, `/w "${playerName}" <br/>Paraselene-Common is not loaded.`, null, { noarchive: true });
            return false;
        }

        // Set up the convenience aliases for ParaseleneCommon.
        pc = ParaseleneCommon;
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
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Get-Token-Info`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const selectedTokenId = msg.selected[0]._id;
        const playerId = msg.playerid

        sendChat(speakAs, `!${scriptName}-Get-Token-Info-API --speakAs ${speakAs} ${playerId} ${selectedTokenId}`);
    };

    // Get information about a token. Intended to be called from other scripts.
    const getTokenInfoAPI = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Get-Token-Info-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = args[1];
        const tokenId = args[2];

        const playerName = getObj('player', playerId).get('displayname');

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
        const left = token.get('left');
        const top = token.get('top');
        const width = token.get('width');
        const height = token.get('height');
        const rotation = token.get('rotation');
        const layer = token.get('layer');
        const controlledby = pc.stringOrBlank(token.get('controlledby'));

        const cellStyle = 'padding-left: 10px; padding-right: 10px;';
        const info_table = new Table()
            .add(new Row()
                .add(new Header(name, 'text-align: center;')
                    .addAttribute(new Attribute('colspan', '2'))
                )
            )
            .add(new Row()
                .add(new Header('id:'))
                .add(new Cell(id, cellStyle))
            )
            .add(new Row()
                .add(new Header('name:'))
                .add(new Cell(name, cellStyle))
            )
            .add(new Row()
                .add(new Header('imgsrc:'))
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
                ))
            )
            .add(new Row()
                .add(new Header('represents:'))
                .add(new Cell(represents, cellStyle))
            )
            .add(new Row()
                .add(new Header('left:'))
                .add(new Cell(left, cellStyle))
            )
            .add(new Row()
                .add(new Header('top:'))
                .add(new Cell(top, cellStyle))
            )
            .add(new Row()
                .add(new Header('width:'))
                .add(new Cell(width, cellStyle))
            )
            .add(new Row()
                .add(new Header('height:'))
                .add(new Cell(height, cellStyle))
            )
            .add(new Row()
                .add(new Header('rotation:'))
                .add(new Cell(rotation, cellStyle))
            )
            .add(new Row()
                .add(new Header('layer:'))
                .add(new Cell(layer, cellStyle))
            )
            .add(new Row()
                .add(new Header('controlledby:'))
                .add(new Cell(controlledby, cellStyle))
            );

        const action_table = new Table()
            .add(new Row()
                .add(new Cell(
                    new Link(
                        `!${scriptName}-Delete-Token-API --speakAs ${speakAs} ${playerId} ${id}`,
                        `Delete this token (Cannot be undone. Be sure.)`,
                    )
                    .render()
                ))
            )
            .add(new Row()
                .add(new Cell(
                    new Link(
                        `!${scriptName}-List-Tokens-API --speakAs ${speakAs} ${playerId} ${id}`,
                        `List other tokens on this token's page`,
                    )
                    .render()
                ))
                )
            .add(new Row()
                .add(new Cell(
                    new Link(
                        `!${scriptName}-Ping-Token-API --speakAs ${speakAs} ${playerId} ${id}`,
                        `Ping this tokens and center on its location`,
                    )
                    .render()
                ))
            );

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${info_table.render()}<p/>${action_table.render()}`);
    };

    // Delete a token. Meant to be called from other scripts.
    const deleteTokenAPI = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Delete-Token-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = args[1];
        const tokenId = args[2];

        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

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
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-List-Tokens-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = args[1];
        const tokenId = args[2];

        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

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
        const pageId = token.get('pageid');

        let page_tokens = findObjs({
            pageid: pageId,
            subtype: 'token',
            type: 'graphic',
        });

        if (page_tokens.length > 1) {
            page_tokens = pc.sortTokens(page_tokens);
        }

        const pageTokensTable = new Table()
            .add(new Row()
                .add(new Header('Token'))
                .add(new Header(
                    'left, top, width, height',
                    'padding-left: 10px; padding-right: 10px;',
                ))
            );
        page_tokens.forEach(token => {
            const id = token.get('id');
            const name = pc.stringOrBlank(token.get('name'));
            const left = token.get('left');
            const top = token.get('top');
            const width = token.get('width');
            const height = token.get('height');

            pageTokensTable
                .add(new Row()
                    .add(new Cell(
                        new Link(`!${scriptName}-Get-Token-Info-API --speakAs ${speakAs} ${playerId} ${id}`, name)
                            .render()
                    ))
                    .add(new Cell(
                        `${left},&nbsp;${top},&nbsp;${width},&nbsp;${height}`,
                        'padding-left: 10px; padding-right: 10px;',
                    ))
                )
        });

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${pageTokensTable.render()}`);
    };

    // Present a menu allowing a player to ping and center a token that they control.
    const pingCharacter = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Ping-Character`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = msg.playerid
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

        const playerPageId = ParaseleneCommon.getPlayerPageId(playerId);
    
        const characters = findObjs({
            type: 'character',
        }).filter(character => {
            const controlledBy = character.get('controlledby').split(',');
            return controlledBy.includes(playerId) || controlledBy.includes('all');
        });
    
        let tokens = [];
        characters.forEach(character => {
            const characterId = character.get('id');
            findObjs({
                pageid: playerPageId,
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
            tokens = ParaseleneCommon.sortTokens(tokens);
        }
    
        const pageTokensTable = new Table()
            .add(new Row()
                .add(new Header('Token'))
                .add(new Header(
                    'left, top, width, height',
                    'padding-left: 10px; padding-right: 10px;',
                ))
            );
        tokens.forEach(token => {
            const id = token.get('id');
            const name = pc.stringOrBlank(token.get('name'));
            const left = token.get('left');
            const top = token.get('top');
            const width = token.get('width');
            const height = token.get('height');

            pageTokensTable
                .add(new Row()
                    .add(new Cell(
                        new Link(`!${scriptName}-Ping-Token-API --speakAs ${speakAs} ${playerId} ${id}`, name)
                            .render()
                    ))
                .add(
                    new ParaseleneCommon.HtmlTableCell(
                        `${left},&nbsp;${top},&nbsp;${width},&nbsp;${height}`,
                        'padding-left: 10px; padding-right: 10px;',
                    )
                )
            )
        });
    
        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${pageTokensTable.render()}`);
    };

    // Ping and center a token.
    const pingTokenAPI = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Ping-Token-API`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = args[1];
        const tokenId = args[2];

        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

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
        const left = token.get('left');
        const top = token.get('top');
        const pageId = token.get('pageid');

        sendPing(left, top, pageId, playerId, true, playerId);
    };

    // Register event handlers.
    const registerEventHandlers = () => {
        on('chat:message', deleteTokenAPI);
        on('chat:message', getTokenInfo);
        on('chat:message', getTokenInfoAPI);
        on('chat:message', listTokensAPI);
        on('chat:message', pingCharacter);
        on('chat:message', pingTokenAPI);
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
