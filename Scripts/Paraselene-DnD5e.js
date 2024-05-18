// Paraselene-DnD5e
// Dungeons & Dragons 5th Edition tools.
// Version 1.2.0

// Github:   https://github.com/neilluna
// By:       Neil Luna
// Contact:  https://app.roll20.net/users/280391/neil-luna

// Register the offset of the start of this script.
var API_Meta = API_Meta || {};
API_Meta.ParaseleneDnD5e = {
    offset: Number.MAX_SAFE_INTEGER,
    lineCount: -1,
    version: '1.2.0',
};
{
    const errorLineNumber = 19;  // Set this to the line number of the "throw new Error('')" below.
    try {
        throw new Error('');  // Set errorLineNumber (above) to this line number.
    }
    catch (exeception) {
        const reportedLineNumber = parseInt(exeception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = reportedLineNumber - errorLineNumber;
        API_Meta.ParaseleneDnD5e.offset = offset;
    }
}

const ParaseleneDnD5e = (() => {

    const scriptName = 'Paraselene-DnD5e';
    const version = API_Meta.ParaseleneDnD5e.version;
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
        log(`-=> ${scriptName} - ${version} by ${scriptAuthor} <=- Meta offset: ${API_Meta.ParaseleneDnD5e.offset}`);
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

    // Present a list of AOE patterns to add.
    const addAoePattern = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Add-AOE-Pattern`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const selected = msg.selected;
        const token = getObj("graphic", selected[0]._id);

        const playerId = msg.playerid;
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

        let spells = {
            AcidSplash: false,
            BurningHands: false,
            CallLightning: false,
            CloudOfDaggers: false,
            Confusion: false,
            ControlWater: false,
            DestructiveWave: false,
            DetectEvilAndGood: false,
            DetectMagic: false,
            DragonsBreath: false,
            EarthTremor: false,
            FlamingSphere: false,
            FogCloud: false,
            GraspingVine: false,
            GuardianOfFaith: false,
            GustOfWind: false,
            Hallow: false,
            IceStorm: false,
            InsectPlague: false,
            LeomundsTinyHut: false,
            MassCureWounds: false,
            Passwall: false,
            PassWithoutTrace: false,
            Shatter: false,
            Silence: false,
            Sleep: false,
            SleetStorm: false,
            SwordBurst: false,
            Thunderclap: false,
            Thunderwave: false,
            Trajectory: false,
            ZoneOfTruth: false,
        };

        let index = 1;
        while (index < args.length) {
            const arg = args[index++].match(/^\s*(.*?)(<br\/>)?\s*$/)[1];
            if (arg === '{{' || arg === '}}') {
                continue;
            }
            if (!spells.hasOwnProperty(arg)) {
                pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>"${arg}" is not recognized.`);
            }
            spells[arg] = true;
        }

        let menu = [`&{template:traits}{{name=Add AOE Pattern}} {{description=${token.get('name')}`];
        if (spells.AcidSplash) {
            menu.push('[Acid Splash](~ParaseleneDnD5e|AddAOEAcidSplash)');
        }
        if (spells.BurningHands) {
            menu.push('[Burning Hands](~ParaseleneDnD5e|AddAOEBurningHands)');
        }
        if (spells.CallLightning) {
            menu.push('[Call Lightning - Cloud](~ParaseleneDnD5e|AddAOECallLightningCloud)');
            menu.push('[Call Lightning - Strike](~ParaseleneDnD5e|AddAOECallLightningStrike)');
        }
        if (spells.CloudOfDaggers) {
            menu.push('[Cloud of Daggers](~ParaseleneDnD5e|AddAOECloudOfDaggers)');
        }
        if (spells.Confusion) {
            menu.push('[Confusion](~ParaseleneDnD5e|AddAOEConfusion)');
        }
        if (spells.ControlWater) {
            menu.push('[Control Water](~ParaseleneDnD5e|AddAOEControlWater)');
        }
        if (spells.DestructiveWave) {
            menu.push('[Destructive Wave](~ParaseleneDnD5e|AddAOEDestructiveWave)');
        }
        if (spells.DetectEvilAndGood) {
            menu.push('[Detect Evil and Good](~ParaseleneDnD5e|AddAOEDetectEvilAndGood)');
        }
        if (spells.DetectMagic) {
            menu.push('[Detect Magic](~ParaseleneDnD5e|AddAOEDetectMagic)');
        }
        if (spells.DragonsBreath) {
            menu.push('[Dragon\'s Breath](~ParaseleneDnD5e|AddAOEDragonsBreath)');
        }
        if (spells.EarthTremor) {
            menu.push('[Earth Tremor](~ParaseleneDnD5e|AddAOEEarthTremor)');
        }
        if (spells.FlamingSphere) {
            menu.push('[Flaming Sphere](~ParaseleneDnD5e|AddAOEFlamingSphere)');
        }
        if (spells.FogCloud) {
            menu.push('[Fog Cloud](~ParaseleneDnD5e|AddAOEFogCloud)');
        }
        if (spells.GraspingVine) {
            menu.push('[Grasping Vine](~ParaseleneDnD5e|AddAOEGraspingVine)');
        }
        if (spells.GuardianOfFaith) {
            menu.push('[Guardian of Faith](~ParaseleneDnD5e|AddAOEGuardianOfFaith)');
        }
        if (spells.GustOfWind) {
            menu.push('[Gust of Wind](~ParaseleneDnD5e|AddAOEGustOfWind)');
        }
        if (spells.Hallow) {
            menu.push('[Hallow](~ParaseleneDnD5e|AddAOEHallow)');
        }
        if (spells.IceStorm) {
            menu.push('[Ice Storm](~ParaseleneDnD5e|AddAOEIceStorm)');
        }
        if (spells.InsectPlague) {
            menu.push('[Insect Plague](~ParaseleneDnD5e|AddAOEInsectPlague)');
        }
        if (spells.LeomundsTinyHut) {
            menu.push('[Leomund\'s Tiny Hut](~ParaseleneDnD5e|AddAOELeomundsTinyHut)');
        }
        if (spells.MassCureWounds) {
            menu.push('[Mass Cure Wounds](~ParaseleneDnD5e|AddAOEMassCureWounds)');
        }
        if (spells.Passwall) {
            menu.push('[Passwall](~ParaseleneDnD5e|AddAOEPasswall)');
        }
        if (spells.PassWithoutTrace) {
            menu.push('[Pass Without Trace](~ParaseleneDnD5e|AddAOEPassWithoutTrace)');
        }
        if (spells.Shatter) {
            menu.push('[Shatter](~ParaseleneDnD5e|AddAOEShatter)');
        }
        if (spells.Silence) {
            menu.push('[Silence](~ParaseleneDnD5e|AddAOESilence)');
        }
        if (spells.Sleep) {
            menu.push('[Sleep](~ParaseleneDnD5e|AddAOESleep)');
        }
        if (spells.SleetStorm) {
            menu.push('[Sleet Storm](~ParaseleneDnD5e|AddAOESleetStorm)');
        }
        if (spells.SwordBurst) {
            menu.push('[Sword Burst](~ParaseleneDnD5e|AddAOESwordBurst)');
        }
        if (spells.Thunderclap) {
            menu.push('[Thunderclap](~ParaseleneDnD5e|AddAOEThunderclap)');
        }
        if (spells.Thunderwave) {
            menu.push('[Thunderwave](~ParaseleneDnD5e|AddAOEThunderwave)');
        }
        if (spells.Trajectory) {
            menu.push('[Trajectory](~ParaseleneDnD5e|AddAOETrajectory)');
        }
        if (spells.ZoneOfTruth) {
            menu.push('[Zone of Truth](~ParaseleneDnD5e|AddAOEZoneOfTruth)');
        }
        menu.push('}}');

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${menu.join('\n')}`);
    };

    // Present a list of spells to cast.
    const castSpell = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Cast-Spell`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const selected = msg.selected;
        const token = getObj("graphic", selected[0]._id);

        const playerId = msg.playerid;
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

        let spells = {
            ChaosBolt: false,
            MagicMissile: false,
        };

        let index = 1;
        while (index < args.length) {
            const arg = args[index++].match(/^\s*(.*?)(<br\/>)?\s*$/)[1];
            if (arg === '{{' || arg === '}}') {
                continue;
            }
            if (!spells.hasOwnProperty(arg)) {
                pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>"${arg}" is not recognized.`);
            }
            spells[arg] = true;
        }

        let menu = [`&{template:traits}{{name=Cast Spell}} {{description=${token.get('name')}`];
        if (spells.ChaosBolt) {
            menu.push('[Chaos Bolt](~ParaseleneDnD5e|ChaosBolt)');
        }
        if (spells.MagicMissile) {
            menu.push('[Magic Missile](~ParaseleneDnD5e|MagicMissile)');
        }
        menu.push('}}');

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${menu.join('\n')}`);
    };

    // Register event handlers.
    const registerEventHandlers = () => {
        on('chat:message', addAoePattern);
        on('chat:message', castSpell);
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

})();  // ParaseleneDnD5e

// Register the length of this script.
{
    // Set this to the number of lines following the "throw new Error('')" below.
    const numberOfLinesFromErrorToScriptEnd = 9;
    try {
        throw new Error('');  // Set numberOfLinesFromErrorToScriptEnd to the number of lines following this line.
    }
    catch (exception) {
        const reportedLineNumber = parseInt(exception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = API_Meta.ParaseleneDnD5e.offset;
        const lineCount = reportedLineNumber - offset + numberOfLinesFromErrorToScriptEnd;
        API_Meta.ParaseleneDnD5e.lineCount = lineCount;
    }
}
