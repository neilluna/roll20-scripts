// Paraselene-Updater
// Updater for Paraselene abilities and macros.
// Version 1.0.0

// Github:   https://github.com/neilluna
// By:       Neil Luna
// Contact:  https://app.roll20.net/users/280391/neil-luna

// Register the offset of the start of this script.
var API_Meta = API_Meta || {};
API_Meta.ParaseleneUpdater = {
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
        API_Meta.ParaseleneUpdater.offset = offset;
    }
}

const ParaseleneUpdater = (() => {

    const scriptName = 'Paraselene-Updater';
    const version = API_Meta.ParaseleneUpdater.version;
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
        log(`-=> ${scriptName} - ${version} by ${scriptAuthor} <=- Meta offset: ${API_Meta.ParaseleneUpdater.offset}`);
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

    // ParaseleneUpdater abilities.
    const paraseleneDnD5eAbilities = [
        [
            '!# AOEBurningHands',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/burning-hands',
            '!# Red - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ff000050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|5econe',
            '  --forceIntersection|0',
            '  --radius|15ft',
            '  --tooltip|@{selected|token_name} - Burning Hands',
            '  --origin|nearest, face',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOECallLightningCloud',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/call-lightning',
            '!# DarkGrey - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#a9a9a950',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|60ft',
            '  --tooltip|@{selected|token_name} - Call Lightning Cloud',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOECallLightningStrike',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/call-lightning',
            '!# White - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ffffff',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|5ft',
            '  --tooltip|@{selected|token_name} - Call Lightning Strike',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEControlWater',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/control-water',
            '!# SeaGreen - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#2e8b5750',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|square, float',
            '  --forceIntersection|0',
            '  --radius|100ft',
            '  --tooltip|@{selected|token_name} - Control Water',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEDestructiveWave',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/destructive-wave',
            '!# Tan - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#d2b48c50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|30ft',
            '  --tooltip|@{selected|token_name} - Destructive Wave',
            '  --controlTokName|self',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEDetectEvilAndGood',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/detect-evil-and-good',
            '!# Magenta - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ff00ff50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|30ft',
            '  --tooltip|@{selected|token_name} - Detect Evil And Good',
            '  --controlTokName|self',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEDetectMagic',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/detect-magic',
            '!# Magenta - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ff00ff50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|30ft',
            '  --tooltip|@{selected|token_name} - Detect Magic',
            '  --controlTokName|self',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEDragonsBreath',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/dragons-breath',
            '!# Red - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ff000050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|5econe',
            '  --forceIntersection|0',
            '  --radius|15ft',
            '  --tooltip|@{selected|token_name} - Dragon\'s Breath',
            '  --origin|nearest, face',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEEarthTremor',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/earth-tremor',
            '!# Tan - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#d2b48c50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|10ft',
            '  --tooltip|@{selected|token_name} - Earth Tremor',
            '  --controlTokName|self',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEFlamingSphere',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/flaming-sphere',
            '!# Red - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ff000050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|5ft',
            '  --tooltip|@{selected|token_name} - Flaming Sphere',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEFogCloud',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/fog-cloud',
            '!# Grey - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#80808050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|[[(?{Fog Cloud - Cast at what Level?|1|2|3|4|5|6|7|8|9}*20)]]ft',
            '  --tooltip|@{selected|token_name} - Fog Cloud',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEGuardianOfFaith',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/guardian-of-faith',
            '!# Gold - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ffd70050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|10ft',
            '  --tooltip|@{selected|token_name} - Guardian of Faith',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEGustOfWind',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/gust-of-wind',
            '!# SkyBlue - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#87ceeb50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|wall',
            '  --forceIntersection|0',
            '  --radius|60ft',
            '  --tooltip|@{selected|token_name} - Gust of Wind',
            '  --origin|nearest, face',
            '  --width|10ft',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEHallow',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/hallow',
            '!# Gold - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ffd70050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|60ft',
            '  --tooltip|@{selected|token_name} - Hallow',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEIceStorm',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/ice-storm',
            '!# Snow - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#fffafa50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|20ft',
            '  --tooltip|@{selected|token_name} - Ice Storm',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEInsectPlague',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/insect-plague',
            '!# GreenYellow - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#adff2f50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|20ft',
            '  --tooltip|@{selected|token_name} - Insect Plague',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEMassCureWounds',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/mass-cure-wounds',
            '!# Cyan - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#00ffff50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|30ft',
            '  --tooltip|@{selected|token_name} - Mass Cure Wounds',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEShatter',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/shatter',
            '!# DarkSlateBlue - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#483d8b50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|10ft',
            '  --tooltip|@{selected|token_name} - Shatter',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOESilence',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/silence',
            '!# GoldenRod - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#daa52050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|20ft',
            '  --tooltip|@{selected|token_name} - Silence',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOESleep',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/sleep',
            '!# LightBlue - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#add8e650',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|20ft',
            '  --tooltip|@{selected|token_name} - Sleep',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOESleetStorm',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/sleet-storm',
            '!# Snow - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#fffafa50',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|40ft',
            '  --tooltip|@{selected|token_name} - Sleet Storm',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEThunderwave',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/thunderwave',
            '!# SeaGreen - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#2e8b5750',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|wall',
            '  --forceIntersection|0',
            '  --radius|15ft',
            '  --tooltip|@{selected|token_name} - Thunderwave',
            '  --origin|nearest, face',
            '  --width|15ft',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOETrajectory',
            '!# Version 1.0.1',
            '!# Grey - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#80808050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|line',
            '  --forceIntersection|0',
            '  --tooltip|@{selected|token_name} - Trajectory',
            '  --origin|nearest, face',
            '}}',
        ].join('\n') + '\n',
        [
            '!# AOEZoneOfTruth',
            '!# Version 1.0.1',
            '!# https://www.dndbeyond.com/spells/zone-of-truth',
            '!# Gold - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe {{',
            '  --aoeColor|#ffd70050',
            '  --aoeOutlineColor|#00000050',
            '  --aoeType|circle, float',
            '  --forceIntersection|0',
            '  --radius|15ft',
            '  --tooltip|@{selected|token_name} - Zone of Truth',
            '}}',
        ].join('\n') + '\n',
    ];

    const update = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = scriptName;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = msg.playerid
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

        const characterName = 'ParaseleneDnD5e';
        const characters = findObjs({
            type: 'character',
            name: characterName,
        });

        if (characters.length == 0) {
            pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>Could not find character ParaseleneDnD5e.`);
            return;
        }
    };

    // Update the abilities on ParaSeleneDnD5e.
    const updateParaseleneDnD5eAbilities = (speakAs, playerName) => {
        const characterName = 'ParaseleneDnD5e';
        const characters = findObjs({
            type: 'character',
            name: characterName,
        });

        if (characters.length == 0) {
            pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>Could not find character ${characterName}.`);
            return;
        }

        const character = characters[0];

        let summary = `${characterName}<br/>`;
        paraseleneDnD5eAbilities.forEach(newAbility => {
            const lines = newAbility.split('\n');
            const name = lines[0].match(/^!#\s*(\S+)$/)[1];
            pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${name}`);

            const currentAbilities = findObjs({
                type: 'ability',
                name: name,
                characterid: character.id,
            });

            if (currentAbilities.length == 0) {
                createObj(
                    'ability',
                    {
                        name: name,
                        action: newAbility,
                        characterid: character.id,
                    });
                summary += `- Created ${name}<br/>`;
            } else {
                currentAbilities[0].set({
                    action: newAbility,
                });
                summary += `- Updated ${name}<br/>`;
            }        
        });

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${summary}`);
    };

    // Install or update all abilities and macros in the Paraselene ecosystem.
    const updateAbilitiesAndMacros = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = scriptName;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = msg.playerid
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

        updateParaseleneDnD5eAbilities(speakAs, playerName);
    };

    // Register event handlers.
    const registerEventHandlers = () => {
        on('chat:message', updateAbilitiesAndMacros);
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

})();  // ParaseleneUpdater

// Register the length of this script.
{
    // Set this to the number of lines following the "throw new Error('')" below.
    const numberOfLinesFromErrorToScriptEnd = 9;
    try {
        throw new Error('');  // Set numberOfLinesFromErrorToScriptEnd to the number of lines following this line.
    }
    catch (exception) {
        const reportedLineNumber = parseInt(exception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = API_Meta.ParaseleneUpdater.offset;
        const lineCount = reportedLineNumber - offset + numberOfLinesFromErrorToScriptEnd;
        API_Meta.ParaseleneUpdater.lineCount = lineCount;
    }
}
