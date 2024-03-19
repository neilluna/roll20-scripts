// Paraselene-Common
// Common utilites used by other Paraselene scripts.
// Version 1.0.0

// Github:   https://github.com/neilluna
// By:       Neil Luna
// Contact:  https://app.roll20.net/users/280391/neil-luna

// Register the offset of the start of this script.
var API_Meta = API_Meta || {};
API_Meta.ParaseleneCommon = {
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
        API_Meta.ParaseleneCommon.offset = offset;
    }
}

const ParaseleneCommon = (() => {

    const scriptName = 'Paraselene-Common';
    const version = API_Meta.ParaseleneCommon.version;
    const schemaVersion = '1.0.0';
    const scriptAuthor = 'Neil Luna';
 
    const versionInfo = () => {
        log(`-=> ${scriptName} - ${version} by ${scriptAuthor} <=- Meta offset: ${API_Meta.ParaseleneCommon.offset}`);
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

    // Extract a command line option from the args array.
    const extractCommandLineOption = (args, option, defaultValue = '') => {
        let value = defaultValue;
        const index = args.indexOf(option);
        if (index >= 0) {
            args.splice(index, 1);
            if (index < args.length) {
                value = args[index];
                args.splice(index, 1);
            }
        }
        return value;
    };

    // Return the page that a player is on.
    const getPlayerPageId = (playerId) => {
        let playerPageId = Campaign().get('playerpageid');
        const playerPages = Campaign().get('playerspecificpages');
        if (playerPages != false && playerPages.hasOwnProperty(playerId)) {
            playerPageId = playerPages[playerId];
        }
        return playerPageId;
    };

    // Base class for an HTML element attribute.
    const HtmlAttribute = class {
        constructor(name, value) {
            this.name = name;
            this.value = value;
        }
        render() {
            return `${this.name}="${this.value}"`;
        }
    };

    // Base class for an HTML element.
    const HtmlElement = class {
        constructor(tag, content = null, style = null) {
            this.tag = tag;
            this.attributes = [];
            if (style) {
                this.addAttribute(new HtmlAttribute('style', style));
            }
            this.content = content;
        }
        addAttribute(attribute) {
            this.attributes.push(attribute);
            return this;
        }
        setContent(content) {
            this.content = content;
        }
        render() {
            const attributeString = this.attributes.map((attribute) => {
                return attribute.render();
            }).join(' ');
            if (this.content === null) {
                return `<${this.tag} ${attributeString} />`;
            }
            return `<${this.tag} ${attributeString}>${this.content}</${this.tag}>`;
        }
    };

    // Base class for an HTML container.
    const HtmlContainer = class extends HtmlElement {
        constructor(tag, style = null) {
            super(tag, null, style);
            this.items = [];
        }
        add(item) {
            this.items.push(item);
        }
        render() {
            this.setContent(this.items.map((item) => {
                return item.render();
            }).join(''));
            return super.render();
        }
    };

    // Create an HTML table.
    const HtmlTable = class extends HtmlContainer {
        constructor(style = null) {
            super('table', style);
        }
        add(row) {
            super.add(row);
            return this;
        }
    };

    // Create an HTML table row.
    const HtmlTableRow = class extends HtmlContainer {
        constructor(style = null) {
            super('tr', style);
        }
        add(cell) {
            super.add(cell);
            return this;
        }
    };

    // Create an HTML table header.
    const HtmlTableHeader = class extends HtmlElement {
        constructor(content, style = null) {
            super('th', content, style);
        }
    };

    // Create an HTML table cell (data).
    const HtmlTableCell = class extends HtmlElement {
        constructor(content, style = null) {
            super('td', content, style);
        }
    };

    // Create an HTML link (anchor tag).
    const HtmlLink = class extends HtmlElement {
        constructor(href, description, style = null) {
            super('a', description, style);
            this.href = href;
            this.description = description;
            this.addAttribute(new HtmlAttribute('href', href));
        }
    };

    // Create a bordered HTML table.
    const HtmlBorderedTable = class extends HtmlTable {
        constructor(style = null) {
            let new_style = 'width: 100%; border: 1px solid; border-collapse: collapse;';
            if (style) {
                new_style = `${new_style} ${style}`;
            }
            super(new_style);
        }
    };

    // Create a bordered HTML table row.
    const HtmlBorderedTableRow = class extends HtmlTableRow {
        constructor(style = null) {
            let new_style = 'border: 1px solid;';
            if (style) {
                new_style = `${new_style} ${style}`;
            }
            super(new_style);
        }
    };

    // Create a bordered HTML table header.
    const HtmlBorderedTableHeader = class extends HtmlTableHeader {
        constructor(content, style = null) {
            let new_style = 'border: 1px solid;';
            if (style) {
                new_style = `${new_style} ${style}`;
            }
            super(content, new_style);
        }
    };

    // Create a bordered HTML table cell (data).
    const HtmlBorderedTableCell = class extends HtmlTableCell {
        constructor(content, style = null) {
            let new_style = 'border: 1px solid;';
            if (style) {
                new_style = `${new_style} ${style}`;
            }
            super(content, new_style);
        }
    };

    // Send a chat message to the player or GM. Do not archive it.
    const sendChatNoArchive = (speakAs, message) => {
        sendChat(speakAs, message, null, { noarchive: true });
    };

    // Send a chat message to a player that a token does not exist.
    const sendChatTokenDoesNotExist = (speakAs, playerName) => {
        sendChatNoArchive(speakAs, `/w "${playerName}" <br/>That token is no longer in the game.`);
    };

    // Send a chat message to a player that a token does not exist.
    const sendChatTokenNotOnPage = (speakAs, playerName) => {
        sendChatNoArchive(speakAs, `/w "${playerName}" <br/>That token is no longer on this map.`);
    };

    // Sort an array of tokens by name.
    const sortTokens = (tokens) => {
        return tokens.sort((token1, token2) => {
            const name1 = stringOrBlank(token1.get('name').toLowerCase());
            const name2 = stringOrBlank(token2.get('name').toLowerCase());
            return name1 < name2 ? -1 : (name1 > name2 ? 1 : 0);
        });
    };

    // Return "<Blank>" is the given string is blank. Otherwise return the string,
    const stringOrBlank = (str) => {
        return str.length > 0 ? str : '&lt;Blank&gt;';
    };

    // When all scripts have loaded ...
    on('ready', () => {
        versionInfo();
        checkSchema();
    });

    // Public interface.
    return {
        extractCommandLineOption: extractCommandLineOption,
        getPlayerPageId: getPlayerPageId,
        HtmlAttribute: HtmlAttribute,
        HtmlElement: HtmlElement,
        HtmlContainer: HtmlContainer,
        HtmlTable: HtmlTable,
        HtmlTableRow: HtmlTableRow,
        HtmlTableHeader: HtmlTableHeader,
        HtmlTableCell: HtmlTableCell,
        HtmlLink: HtmlLink,
        HtmlBorderedTable: HtmlBorderedTable,
        HtmlBorderedTableRow: HtmlBorderedTableRow,
        HtmlBorderedTableHeader: HtmlBorderedTableHeader,
        HtmlBorderedTableCell: HtmlBorderedTableCell,
        sendChatNoArchive: sendChatNoArchive,
        sendChatTokenDoesNotExist: sendChatTokenDoesNotExist,
        sendChatTokenNotOnPage: sendChatTokenNotOnPage,
        sortTokens: sortTokens,
        stringOrBlank: stringOrBlank,
        version: version,
    };

})();  // ParaseleneCommon

// Register the length of this script.
{
    // Set this to the number of lines following the "throw new Error('')" below.
    const numberOfLinesFromErrorToScriptEnd = 9;
    try {
        throw new Error('');  // Set numberOfLinesFromErrorToScriptEnd to the number of lines following this line.
    }
    catch (exception) {
        const reportedLineNumber = parseInt(exception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = API_Meta.ParaseleneCommon.offset;
        const lineCount = reportedLineNumber - offset + numberOfLinesFromErrorToScriptEnd;
        API_Meta.ParaseleneCommon.lineCount = lineCount;
    }
}
