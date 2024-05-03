// Paraselene-Installer
// Update, remove, and install abilities and macros in the Paraselene ecosystem.
// Version 1.0.0

// Github:   https://github.com/neilluna
// By:       Neil Luna
// Contact:  https://app.roll20.net/users/280391/neil-luna

// Register the offset of the start of this script.
var API_Meta = API_Meta || {};
API_Meta.ParaseleneInstaller = {
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
        API_Meta.ParaseleneInstaller.offset = offset;
    }
}

const ParaseleneInstaller = (() => {

    const scriptName = 'Paraselene-Installer';
    const version = API_Meta.ParaseleneInstaller.version;
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
        log(`-=> ${scriptName} - ${version} by ${scriptAuthor} <=- Meta offset: ${API_Meta.ParaseleneInstaller.offset}`);
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

    // Paraselene ecosystem state keys.
    const paraseleneStateKeys = [
        'Paraselene-Common',
        'Paraselene-Tools',
        'Paraselene-DnD5e',
        'Paraselene-Installer',
    ];

    // Deprecated Paraselene ecosystem state keys.
    const paraseleneDeprecatedStateKeys = [
        'Paraselene-Updater',
    ];

    // ParaseleneDnD5e abilities.
    const paraseleneDnD5eAbilities = [

        [
            '!# Paraselene-AddAOEPattern',
            '/w @{selected|character_name} &{template:traits}{{name=Add AOE Pattern}} {{description=' +
            'For @{selected|character_name}',
            '[Burning Hands](~ParaseleneDnD5e|AddAOEBurningHands)',
            '[Call Lightning - Cloud](~ParaseleneDnD5e|AddAOECallLightningCloud)',
            '[Call Lightning - Strike](~ParaseleneDnD5e|AddAOECallLightningStrike)',
            '[Control Water](~ParaseleneDnD5e|AddAOEControlWater)',
            '[Destructive Wave](~ParaseleneDnD5e|AddAOEDestructiveWave)',
            '[Detect Evil and Good](~ParaseleneDnD5e|AddAOEDetectEvilAndGood)',
            '[Detect Magic](~ParaseleneDnD5e|AddAOEDetectMagic)',
            '[Dragon\'s Breath](~ParaseleneDnD5e|AddAOEDragonsBreath)',
            '[Earth Tremor](~ParaseleneDnD5e|AddAOEEarthTremor)',
            '[Flaming Sphere](~ParaseleneDnD5e|AddAOEFlamingSphere)',
            '[Fog Cloud](~ParaseleneDnD5e|AddAOEFogCloud)',
            '[Guardian of Faith](~ParaseleneDnD5e|AddAOEGuardianOfFaith)',
            '[Gust of Wind](~ParaseleneDnD5e|AddAOEGustOfWind)',
            '[Hallow](~ParaseleneDnD5e|AddAOEHallow)',
            '[Ice Storm](~ParaseleneDnD5e|AddAOEIceStorm)',
            '[Insect Plague](~ParaseleneDnD5e|AddAOEInsectPlague)',
            '[Mass Cure Wounds](~ParaseleneDnD5e|AddAOEMassCureWounds)',
            '[Shatter](~ParaseleneDnD5e|AddAOEShatter)',
            '[Silence](~ParaseleneDnD5e|AddAOESilence)',
            '[Sleep](~ParaseleneDnD5e|AddAOESleep)',
            '[Sleet Storm](~ParaseleneDnD5e|AddAOESleetStorm)',
            '[Thunderwave](~ParaseleneDnD5e|AddAOEThunderwave)',
            '[Trajectory](~ParaseleneDnD5e|AddAOETrajectory)',
            '[Zone of Truth](~ParaseleneDnD5e|AddAOEZoneOfTruth)',
            '}}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEBurningHands',
            '!# https://www.dndbeyond.com/spells/burning-hands',
            '!# Red - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ff000050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|5econe ' +
                '--forceIntersection|0 ' +
                '--radius|15ft ' +
                '--origin|nearest, face' +
                '--tooltip|@{selected|token_name} - Burning Hands',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOECallLightningCloud',
            '!# https://www.dndbeyond.com/spells/call-lightning',
            '!# DarkGrey - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#a9a9a950 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|60ft ' +
                '--tooltip|@{selected|token_name} - Call Lightning Cloud',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOECallLightningStrike',
            '!# https://www.dndbeyond.com/spells/call-lightning',
            '!# White - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ffffff ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|5ft ' +
                '--tooltip|@{selected|token_name} - Call Lightning Strike',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEControlWater',
            '!# https://www.dndbeyond.com/spells/control-water',
            '!# SeaGreen - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#2e8b5750 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|square, float ' +
                '--forceIntersection|0 ' +
                '--radius|100ft ' +
                '--tooltip|@{selected|token_name} - Control Water',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEDestructiveWave',
            '!# https://www.dndbeyond.com/spells/destructive-wave',
            '!# Tan - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#d2b48c50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|30ft ' +
                '--controlTokName|self ' +
                '--tooltip|@{selected|token_name} - Destructive Wave',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEDetectEvilAndGood',
            '!# https://www.dndbeyond.com/spells/detect-evil-and-good',
            '!# Magenta - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ff00ff50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|30ft ' +
                '--controlTokName|self ' +
                '--tooltip|@{selected|token_name} - Detect Evil And Good',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEDetectMagic',
            '!# https://www.dndbeyond.com/spells/detect-magic',
            '!# Magenta - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ff00ff50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|30ft ' +
                '--controlTokName|self ' +
                '--tooltip|@{selected|token_name} - Detect Magic',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEDragonsBreath',
            '!# https://www.dndbeyond.com/spells/dragons-breath',
            '!# Red - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ff000050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|5econe ' +
                '--forceIntersection|0 ' +
                '--radius|15ft ' +
                '--origin|nearest, face ' +
                '--tooltip|@{selected|token_name} - Dragon\'s Breath',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEEarthTremor',
            '!# https://www.dndbeyond.com/spells/earth-tremor',
            '!# Tan - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#d2b48c50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|10ft ' +
                '--controlTokName|self ' +
                '--tooltip|@{selected|token_name} - Earth Tremor',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEFlamingSphere',
            '!# https://www.dndbeyond.com/spells/flaming-sphere',
            '!# Red - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ff000050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|5ft ' +
                '--tooltip|@{selected|token_name} - Flaming Sphere',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEFogCloud',
            '!# https://www.dndbeyond.com/spells/fog-cloud',
            '!# Grey - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#80808050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|[[(?{Fog Cloud - Cast at what Level?|1|2|3|4|5|6|7|8|9}*20)]]ft ' +
                '--tooltip|@{selected|token_name} - Fog Cloud',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEGuardianOfFaith',
            '!# https://www.dndbeyond.com/spells/guardian-of-faith',
            '!# Gold - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ffd70050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|10ft ' +
                '--tooltip|@{selected|token_name} - Guardian of Faith',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEGustOfWind',
            '!# https://www.dndbeyond.com/spells/gust-of-wind',
            '!# SkyBlue - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#87ceeb50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|wall ' +
                '--forceIntersection|0 ' +
                '--radius|60ft ' +
                '--origin|nearest, face ' +
                '--width|10ft ' +
                '--tooltip|@{selected|token_name} - Gust of Wind',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEHallow',
            '!# https://www.dndbeyond.com/spells/hallow',
            '!# Gold - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ffd70050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|60ft ' +
                '--tooltip|@{selected|token_name} - Hallow',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEIceStorm',
            '!# https://www.dndbeyond.com/spells/ice-storm',
            '!# Snow - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#fffafa50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|20ft ' +
                '--tooltip|@{selected|token_name} - Ice Storm',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEInsectPlague',
            '!# https://www.dndbeyond.com/spells/insect-plague',
            '!# GreenYellow - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#adff2f50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|20ft ' +
                '--tooltip|@{selected|token_name} - Insect Plague',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEMassCureWounds',
            '!# https://www.dndbeyond.com/spells/mass-cure-wounds',
            '!# Cyan - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#00ffff50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|30ft ' +
                '--tooltip|@{selected|token_name} - Mass Cure Wounds',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEShatter',
            '!# https://www.dndbeyond.com/spells/shatter',
            '!# DarkSlateBlue - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#483d8b50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|10ft ' +
                '--tooltip|@{selected|token_name} - Shatter',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOESilence',
            '!# https://www.dndbeyond.com/spells/silence',
            '!# GoldenRod - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#daa52050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|20ft ' +
                '--tooltip|@{selected|token_name} - Silence',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOESleep',
            '!# https://www.dndbeyond.com/spells/sleep',
            '!# LightBlue - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#add8e650 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|20ft ' +
                '--tooltip|@{selected|token_name} - Sleep',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOESleetStorm',
            '!# https://www.dndbeyond.com/spells/sleet-storm',
            '!# Snow - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#fffafa50 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|40ft ' +
                '--tooltip|@{selected|token_name} - Sleet Storm',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEThunderwave',
            '!# https://www.dndbeyond.com/spells/thunderwave',
            '!# SeaGreen - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#2e8b5750 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|wall ' +
                '--forceIntersection|0 ' +
                '--radius|15ft ' +
                '--origin|nearest, face ' +
                '--width|15ft ' +
                '--tooltip|@{selected|token_name} - Thunderwave',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOETrajectory',
            '!# Grey - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#80808050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|line ' +
                '--forceIntersection|0 ' +
                '--origin|nearest, face ' +
                '--tooltip|@{selected|token_name} - Trajectory',
        ].join('\n') + '\n',
        [
            '!# Paraselene-AddAOEZoneOfTruth',
            '!# https://www.dndbeyond.com/spells/zone-of-truth',
            '!# Gold - https://www.w3schools.com/colors/colors_picker.asp',
            '!smartaoe ' +
                '--aoeColor|#ffd70050 ' +
                '--aoeOutlineColor|#00000050 ' +
                '--aoeType|circle, float ' +
                '--forceIntersection|0 ' +
                '--radius|15ft ' +
                '--tooltip|@{selected|token_name} - Zone of Truth',
        ].join('\n') + '\n',
        [
            '!# Paraselene-ChaosBolt',
            '!script{{',
            '--/|An attack roll must be equal to or greater than this number to get a critical hit.',
            '--=criticalHitThreshold|20',
            '',
            '--/|Set this to 0 to use standard critical hit damage.',
            '--/|Set this to 1 to use variant critical hit damage.',
            '--=useVariantCriticalHitDamage|0',
            '',
            '--#titleCardBackground|#BA5',
            '--#subtitleFontColor|#621',
            '--#oddRowBackground|#EC8',
            '--#evenRowBackground|#ED9',
            '--#emoteFontColor|#000',
            '--#noRollHighlight|noRollHighlight',
            '',
            '--=castLevel|?{Chaos Bolt - Cast at what Level|1|2|3|4|5|6|7|8|9}',
            '--#sourceToken|@{selected|token_id}',
            '--#emoteText|@{selected|character_name} casts a level [$castLevel] Chaos Bolt',
            '--#title|Chaos Bolt',
            '--#leftsub|Range: 120 ft',
            '--#rightsub|Cast at level [$castLevel]',
            '',
            '--=spellSlots|[*@{selected|token_id}:lvl[$castLevel]_slots_expended]',
            '--?[$spellSlots] -ge 1|enoughSpellSlots',
            '--+Warning|[r][#800]No level [$castLevel.Raw] spell slots[/#][/r]',
            '--+|[hr]',
            '--:enoughSpellSlots|',
            '',
            '-->Attack|',
            '',
            '--?[$spellSlots] -le 0|skipDecSpellSlots',
            '--!a:@{selected|token_id}|lvl[$castLevel]_slots_expended:-=1',
            '--=spellSlots|[$spellSlots] - 1',
            '--+|[hr]',
            '--+Level [$castLevel.Raw] Spell Slots Remaining|[r][$spellSlots][/r]',
            '--:skipDecSpellSlots|',
            '--X|',
            '',
            '--:Attack|',
                '--=attackRoll1|1d20 [Base] + @{selected|spell_attack_bonus} [Spell]',
                '',
                '--&attackRoll1Text|[$attackRoll1]',
                '--?[$attackRoll1.Base] -gt 1|skipFumble1Coloring',
                    '--&attackRoll1Text|[#800][$attackRoll1][/#]',
                '--:skipFumble1Coloring|',
                '--?[$attackRoll1.Base] -lt [$criticalHitThreshold]|skipCrit1Coloring',
                    '--&attackRoll1Text|[#080][$attackRoll1][/#]',
                '--:skipCrit1Coloring|',
                '',
                '--=attackRoll2|1d20 [Base] + @{selected|spell_attack_bonus} [Spell]',
                '',
                '--&attackRoll2Text|[$attackRoll2]',
                '--?[$attackRoll2.Base] -gt 1|skipFumble2Coloring',
                    '--&attackRoll2Text|[#800][$attackRoll2][/#]',
                '--:skipFumble2Coloring|',
                '--?[$attackRoll2.Base] -lt [$criticalHitThreshold]|skipCrit2Coloring',
                    '--&attackRoll2Text|[#080][$attackRoll2][/#]',
                '--:skipCrit2Coloring|',
                '--+Ranged Attack|[r][&attackRoll1Text] | [&attackRoll2Text][/r]',
                '',
                '--=dmgRoll1|1d8 [Base]',
                '--=dmgRoll2|1d8 [Base]',
                '',
                '--?[$castLevel] -gt 1|hlDmg',
                    '--=dmgRoll3|1d6 [Base]',
                    '--^dmgDone|',
                '--:hlDmg|',
                    '--=hlDmgDieCount|[$castLevel] - 1',
                    '--=dmgRoll3|1d6 [Base] + [$hlDmgDieCount]d6 [Level [$castLevel]]',
                '--:dmgDone|',
                '',
                '--=dmg|[$dmgRoll1] + [$dmgRoll2] + [$dmgRoll3]',
                '--&dmgRollText|[$dmgRoll1]+[$dmgRoll2]+[$dmgRoll3]',
                '--?[$dmgRoll1.Base] -ne [$dmgRoll2.Base]|skipHopColoring',
                    '--&dmgRollText|[#08F][$dmgRoll1][/#]+[#08F][$dmgRoll2][/#]+[$dmgRoll3]',
                '--:skipHopColoring|',
                '--+Damage|[r][&dmgRollText]=[$dmg][/r]',
                '',
                '--?[$attackRoll1.Base] -lt [$criticalHitThreshold] ' +
                '-and [$attackRoll2.Base] -lt [$criticalHitThreshold]|skipCrit',
                    '--?[$useVariantCriticalHitDamage] -eq 1|calcVarCrit',
                        '--?[$castLevel] -gt 1|calcHlStdCrit',
                            '--=critDmg|2d8 [Base] + 1d6 [Base]',
                            '--^calcCritDone|',
                        '--:calcHlStdCrit|',
                            '--=hlDmgDieCount|[$castLevel] - 1',
                            '--=critDmg|2d8 [Base] + 1d6 [Base] + [$hlDmgDieCount]d6 [Level [$castLevel]]',
                            '--^calcCritDone|',
                    '--:calcVarCrit|',
                        '--?[$castLevel] -gt 1|calcHlVarCrit',
                            '--=critDmg|1d8 [Base] + 8 [Max] + 1d6 [Base]',
                            '--^calcCritDone|',
                        '--:calcHlVarCrit|',
                            '--=hlDmgDieCount|[$castLevel] - 1',
                            '--=critDmg|1d8 [Base] + 8 [Max] + 1d6 [Base] + [$hlDmgDieCount]d6 [Level [$castLevel]]',
                            '--^calcCritDone|',
                    '--:calcCritDone|',
                    '--+Critical Hit Damage|[r][$critDmg][/r]',
                '--:skipCrit|',
                '',
                '--c[$dmgRoll1]|1:&dmgType1;Acid|2:&dmgType1;Cold|3:&dmgType1;Fire|4:&dmgType1;Force|' +
                    '5:&dmgType1;Lightning|6:&dmgType1;Poison|7:&dmgType1;Psychic|8:&dmgType1;Thunder',
                '--c[$dmgRoll2]|1:&dmgType2;Acid|2:&dmgType2;Cold|3:&dmgType2;Fire|4:&dmgType2;Force|' +
                    '5:&dmgType2;Lightning|6:&dmgType2;Poison|7:&dmgType2;Psychic|8:&dmgType2;Thunder',
                '',
                '--?[$dmgRoll1] -ne [$dmgRoll2]|skipHop',
                '--+Damage Type|[r][i][&dmgType1][/i][/r]',
                '--+|[hr]',
                '--+|[c]Chaotic energy leaps to a new target within 30 feet![/c]',
                '--+|[hr]',
                '-->Attack|',
                '--^hopDone|',
                '--:skipHop|',
                '--+Damage Type|[r]Either [i][&dmgType1][/i] or [i][&dmgType2][/i][/r]',
                '--:hopDone|',
            '--<|',
            '}}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-MagicMissile',
            '!script{{',
            '--#titleCardBackground|#BA5',
            '--#subtitleFontColor|#621',
            '--#oddRowBackground|#EC8',
            '--#evenRowBackground|#ED9',
            '--#emoteFontColor|#000',
            '--#noRollHighlight|noRollHighlight',
            '',
            '--=castLevel|?{Magic Missile - Cast at what Level|1|2|3|4|5|6|7|8|9}',
            '--#sourceToken|@{selected|token_id}',
            '--#emoteText|@{selected|character_name} casts a level [$castLevel] Magic Missile',
            '--#title|Magic Missile',
            '--#leftsub|Range: 120 ft',
            '--#rightsub|Cast at level [$castLevel]',
            '',
            '--=spellSlots|[*@{selected|token_id}:lvl[$castLevel]_slots_expended]',
            '--?[$spellSlots] -ge 1|enoughSpellSlots',
            '--+Warning|[r][#800]No level [$castLevel.Raw] spell slots[/#][/r]',
            '--+|[hr]',
            '--:enoughSpellSlots|',
            '',
            '--=numberOfDarts|[$castLevel] + 2',
            '--=dartCounter|1',
            '--:dartLoop|',
            '--=dmg|1d4 [Base] + 1',
            '--+Dart [$dartCounter.Raw] Damage|[r][$dmg][/r]',
            '--=dartCounter|[$dartCounter] + 1',
            '--?[$dartCounter] -le [$numberOfDarts]|dartLoop',
            '--+Damage Type|[r][i]Force[/i][/r]',
            '',
            '--?[$spellSlots] -le 0|skipDecSpellSlots',
            '--!a:@{selected|token_id}|lvl[$castLevel]_slots_expended:-=1',
            '--=spellSlots|[$spellSlots] - 1',
            '--+|[hr]',
            '--+Level [$castLevel.Raw] Spell Slots Remaining|[r][$spellSlots][/r]',
            '--:skipDecSpellSlots|',
            '}}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-SetTokenDefaults',
            '!token-mod ' +
                '--on ' +
                    'showname ' +
                    'showplayers_name ' +
                    'showplayers_bar1 ' +
                '--off ' +
                    'playersedit_name ' +
                    'showplayers_aura1 showplayers_aura2 playersedit_aura1 playersedit_aura2 ' +
                    'showplayers_bar2 showplayers_bar3 playersedit_bar1 playersedit_bar2 playersedit_bar3',
        ].join('\n') + '\n',
        [
            '!# Paraselene-SetTokenLight',
            '!token-mod --set ' +
                '?{Light|' +
                    'None,' +
                        'has_bright_light_vision#on emits_bright_light#off emits_low_light#off ' +
                        'bright_light_distance#0 low_light_distance#0 light_angle#360|' +
                    'Bullseye Lantern,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#60 low_light_distance#60 light_angle#90|' +
                    'Candle,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#2 low_light_distance#5 light_angle#360|' +
                    'Crown of 1-3 Stars,' +
                        'has_bright_light_vision#on emits_bright_light#off emits_low_light#on ' +
                        'bright_light_distance#0 low_light_distance#30 light_angle#360|' +
                    'Crown of 4+ Stars,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#30 low_light_distance#30 light_angle#360|' +
                    'Dancing Lights,' +
                        'has_bright_light_vision#on emits_bright_light#off emits_low_light#on ' +
                        'bright_light_distance#0 low_light_distance#10 light_angle#360|' +
                    'Daylight Spell,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#60 low_light_distance#60 light_angle#360|' +
                    'Faerie Fire,' +
                        'has_bright_light_vision#on emits_bright_light#off emits_low_light#on ' +
                        'bright_light_distance#0 low_light_distance#10 light_angle#360|' +
                    'Gem of Brightness,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#30 low_light_distance#30 light_angle#360|' +
                    'Hooded Lantern,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#30 low_light_distance#30 light_angle#360|' +
                    'Lamp,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#15 low_light_distance#15 light_angle#360|' +
                    'Light Cantrip,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#20 low_light_distance#20 light_angle#360|' +
                    'Spot 5ft,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#5 low_light_distance#0 light_angle#360|' +
                    'Sunblade 10/10,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#10 low_light_distance#10 light_angle#360|' +
                    'Sunblade (1st)15/15,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#15 low_light_distance#15 light_angle#360|' +
                    'Sunblade 20/20,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#20 low_light_distance#20 light_angle#360|' +
                    'Sunblade 25/25,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#25 low_light_distance#25 light_angle#360|' +
                    'Sunblade 30/30,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#30 low_light_distance#30 light_angle#360|' +
                    'Torch,' +
                        'has_bright_light_vision#on emits_bright_light#on emits_low_light#on ' +
                        'bright_light_distance#20 low_light_distance#20 light_angle#360' +
                '}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-SetTokenVision',
            '!token-mod --set ' +
                '?{Vision|' +
                    'Normal (Human),' +
                        'has_bright_light_vision#on has_night_vision#off ' +
                        'night_vision_distance#0 light_angle#360 night_vision_effect#none|' +
                    'Blind,' +
                        'has_bright_light_vision#off has_night_vision#off ' +
                        'night_vision_distance#0 light_angle#360 night_vision_effect#none|' +
                    'Blind Fighting,' +
                        'has_bright_light_vision#on has_night_vision#on ' +
                        'night_vision_distance#10 light_angle#360 night_vision_effect#none|' +
                    'Darkvision 60,' +
                        'has_bright_light_vision#on has_night_vision#on ' +
                        'night_vision_distance#60 light_angle#360 night_vision_effect#nocturnal|' +
                    'Darkvision 90,' +
                        'has_bright_light_vision#on has_night_vision#on ' +
                        'night_vision_distance#90 light_angle#360 night_vision_effect#nocturnal|' +
                    'Darkvision 120,' +
                        'has_bright_light_vision#on has_night_vision#on ' +
                        'night_vision_distance#120 light_angle#360 night_vision_effect#nocturnal|' +
                    'Darkvision 300,' +
                        'has_bright_light_vision#on has_night_vision#on ' +
                        'night_vision_distance#300 light_angle#360 night_vision_effect#nocturnal' +
                '}',
        ].join('\n') + '\n',
    ];

    // ParaseleneTools abilities.
    const paraseleneToolsAbilities = [
        [
            '!# Paraselene-ManageTurnOrder',
            '/w gm &{template:traits} {{name=Manage Turn Order}} {{description=' +
            '**Announcements**',
            '[Toggle rounds](!tm toggle-announce)',
            '[Toggle turns](!tm toggle-announce-turn)',
            '[Toggle include player names](!tm toggle-announce-player)',
            '**Preparation**',
            '[Set round counter](!tm reset ' +
                '&#63;{Set round value to|0}) ' +
                '&lbrack;value&rbrack;',  // [value]
            '[Add down counter](!act -1 ' +
                '&#63;{Start counter at|10} ' +
                '--index 0 ' +
                '--&#63;{Counter name}) ' +
                '&lbrack;value&rbrack; &lbrack;name&rbrack;',  // [value] [name]
            '**Window**',
            '[Toggle visibilty](!group-init --toggle-turnorder)',
            '[Sort](!group-init --sort)',
            '[Clear and Close](!group-init --clear)',
            '}}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-ManageTurnOrderStack',
            '/w gm &{template:traits} {{name=Manage Turn Order Stack}} {{description=' +
            '**Operations**',
            '[List](!group-init --stack list)',
            '[Push to last](!group-init --stack push) ' +
                '[with label](!group-init --stack push &#63;{Stack item label})',
            '[Pop from last](!group-init --stack pop)',
            '[Pop merge from last](!group-init --stack merge)',
            '[Push copy to last](!group-init --stack copy) ' +
                '[with label](!group-init --stack copy &#63;{Stack item label})',
            '[Copy from first](!group-init --stack apply)',
            '[Copy merge from first](!group-init --stack apply-merge)',
            '[Swap with first](!group-init --stack swap) ' +
                '[with label](!group-init --stack swap &#63;{Stack item label})',
            '[Swap with last](!group-init --stack tail-swap) ' +
                '[with label](!group-init --stack tail-swap &#63;{Stack item label})',
            '[Rotate into first](!group-init --stack reverse-rotate) ' +
                '[with label](!group-init --stack reverse-rotate &#63;{Stack item label})',
            '[Rotate into last](!group-init --stack rotate) ' +
                '[with label](!group-init --stack rotate &#63;{Stack item label})',
            '[Clear](!group-init --stack clear)',
            '**Stack Tips**',
            '- To rotate the stack upward, do a "Rotate into last", then a "Swap with last".',
            '- To rotate the stack downward, do a "Rotate into first", then a "Swap with first".',
            '}}',
        ].join('\n') + '\n',
    ];

    // Paraselene macros.
    const paraseleneMacros = [
        [
            '!# Paraselene-Add-AOE-Pattern',
            '!# Settings: Token Action: Yes, Visibility: All Players',
            '%{ParaseleneDnD5e|AddAOEPattern}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Remove-AOE-Pattern',
            '!# Settings: Token Action: Yes, Visibility: All Players',
            '!smartremove',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Change-Map',
            '!# Settings: Visibility: All Players',
            '!mc menu --show public',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Change-Map-GM-Only',
            '!mc menu',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Clear-Token-Status',
            '!# Settings: Token Action: Yes',
            '!token-mod --set statusmarkers#=',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Dynamic-Lighting-Tool',
            '!dltool',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Get-Token-Info',
            '!# Settings: Token Action: Yes',
            '!Paraselene-Tools-Get-Token-Info --speakAs Info',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Install',
            '!Paraselene-Installer-Install',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Kill-Token',
            '!# Settings: Token Action: Yes',
            '!token-mod --order top --set layer#map statusmarkers#dead',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Manage-Turn-Order',
            '%{ParaseleneTools|ManageTurnOrder}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Manage-Turn-Order-Stack',
            '%{ParaseleneTools|ManageTurnOrderStack}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Ping-Character',
            '!# Settings: Visibility: All Players',
            '!Paraselene-Tools-Ping-Character --speakAs Ping-Character',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Set-Token-Defaults',
            '!# Settings: Token Action: Yes',
            '%{ParaseleneDnD5e|SetTokenDefaults}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Set-Token-Light',
            '!# Settings: Token Action: Yes',
            '%{ParaseleneDnD5e|SetTokenLight}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Set-Token-Vision',
            '!# Settings: Token Action: Yes',
            '%{ParaseleneDnD5e|SetTokenVision}',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Teleport-Menu',
            '!teleport --menu',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Toggle-Token-Hunters-Mark',
            '!# Settings: Token Action: Yes',
            '!token-mod --set statusmarkers#!archery-target',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Add-Token-Actions',
            '!# Settings: Token Action: Yes',
            '!sortta',
        ].join('\n') + '\n',
        [
            '!# Paraselene-Remove-Token-Actions',
            '!# Settings: Token Action: Yes',
            '!deleteta',
        ].join('\n') + '\n',
    ];

    // Update, remove, and install abilities and macros in the Paraselene ecosystem.
    const install = (msg) => {
        if (!isParseleneCommonLoaded()) {
            return;
        }

        const commandName = `${scriptName}-Install`;
        const args = msg.content.split(/\s+/);
        if (msg.type != 'api' || args[0] != `!${commandName}`) {
            return;
        }
        const speakAs = pc.extractCommandLineOption(args, '--speakAs', commandName);

        const playerId = msg.playerid
        const player = getObj('player', playerId);
        const playerName = player.get('displayname');

        updateAbilities(speakAs, playerName, 'ParaseleneDnD5e', paraseleneDnD5eAbilities);
        updateAbilities(speakAs, playerName, 'ParaseleneTools', paraseleneToolsAbilities);
        updateParaseleneMacros(speakAs, playerId, playerName);
    };

    // Update, remove, and install ParaseleneDnD5e abilities.
    const updateAbilities = (speakAs, playerName, characterName, newActionsList) => {
        const characters = findObjs({
            type: 'character',
            name: characterName,
        });

        if (characters.length == 0) {
            pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>Could not find character ${characterName}.`);
            return;
        }

        const character = characters[0];

        // Create a list of the existing Paraselene abilities.
        const existingAbilities = findObjs({
            type: 'ability',
            characterid: character.id,
        }).filter(ability => {
            return isParaseleneAction(ability.get('action'));
        });

        // Create an index of the new actions.
        const newActionsIndex = indexParaseleneActions(newActionsList);

        let summary = '';
        if (existingAbilities.length > 0) {
            summary += `Updating and removing ${characterName} abilities<br/>`;
            existingAbilities.forEach(ability => {
                const name = ability.get('name');
                const action = ability.get('action');
                const canonicalName = getParaseleneActionCanonicalName(action);
                const displayName = `${name} (${canonicalName})`;
                if (newActionsIndex.hasOwnProperty(canonicalName)) {
                    const newAction = newActionsList[newActionsIndex[canonicalName]];
                    if (action == newAction) {
                        summary += `- ${displayName} is up to date.<br/>`;
                    } else {
                        ability.set({
                            action: newAction,
                        });
                        summary += `- ${displayName} updated.<br/>`;
                    }
                } else {
                    ability.remove();
                    summary += `- ${displayName} removed.<br/>`;
                }
            });
        }

        const existingAbilityNames = existingAbilities.map(ability => {
            return ability.get('name');
        });
        const actionsToInstall = newActionsList.filter(action => {
            return !(existingAbilityNames.includes(getParaseleneAbilityName(action)));
        });

        if (actionsToInstall.length > 0) {
            summary += `Installing ${characterName} abilities<br/>`;
            actionsToInstall.forEach(action => {
                const name = getParaseleneAbilityName(action);
                const displayName = `${name} (${getParaseleneActionCanonicalName(action)})`;
                createObj(
                    'ability',
                    {
                        name: name,
                        action: action,
                        characterid: character.id,
                    }
                );
                summary += `- ${displayName} installed.<br/>`;
            });
        };

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${summary}`);
    };

    // Update, remove, and install Paraselene macros.
    const updateParaseleneMacros = (speakAs, playerId, playerName) => {

        // Create a list of the existing Paraselene macros.
        const existingMacros = findObjs({
            type: 'macro',
        }).filter(macro => {
            return isParaseleneAction(macro.get('action'));
        });

        // Create an index of the new actions.
        const newActionIndex = indexParaseleneActions(paraseleneMacros);

        let summary = '';
        if (existingMacros.length > 0) {
            summary += 'Updating and removing macros<br/>';
            existingMacros.forEach(macro => {
                const name = macro.get('name');
                const action = macro.get('action');
                const canonicalName = getParaseleneActionCanonicalName(action);
                const displayName = name == canonicalName ? name : `${name} (${canonicalName})`;
                if (newActionIndex.hasOwnProperty(canonicalName)) {
                    const newAction = paraseleneMacros[newActionIndex[canonicalName]];
                    if (action == newAction) {
                        summary += `- ${displayName} is up to date.<br/>`;
                        return;
                    } else {
                        macro.set({
                            action: newAction,
                        });
                        summary += `- ${displayName} updated.<br/>`;
                    }
                } else {
                    macro.remove();
                    summary += `- ${displayName} removed.<br/>`;
                }
            });
        }

        const existingMacroCanonicalNames = existingMacros.map(macro => {
            return getParaseleneActionCanonicalName(macro.get('action'));
        });
        const actionsToInstall = paraseleneMacros.filter(action => {
            return  !(existingMacroCanonicalNames.includes(getParaseleneActionCanonicalName(action)));
        });

        if (actionsToInstall.length > 0) {
            summary += 'Installing macros<br/>';
            actionsToInstall.forEach(action => {
                const name = getParaseleneActionCanonicalName(action);
                const settings = getParaseleneMacroSettings(action);
                let macroAttributes = {
                    name: name,
                    action: action,
                    istokenaction: settings['Token Action'] == 'Yes',
                    playerid: playerId,
                };
                if (settings['Visibility'] == 'All Players') {
                    macroAttributes.visibleto = 'all';
                }
                createObj(
                    'macro',
                    macroAttributes,
                );
                summary += `- ${name} installed.<br/>`;
            });
        }

        pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${summary}`);
    };

    // Is an action a Paraselene action?
    const isParaseleneAction = (action) => {
        const lines = action.split('\n');
        return lines.length >= 2 && /^!# Paraselene-\S*$/.test(lines[0]);
    }

    // Return the canonical name of a Paraselene ability or macro action.
    const getParaseleneActionCanonicalName = (action) => {
        return action.split('\n')[0].substring('!# '.length);
    }

    // Return the abilty name of a Paraselene ability action.
    const getParaseleneAbilityName = (action) => {
        return getParaseleneActionCanonicalName(action).substring('Paraselene-'.length);
    }

    // Return the index of a list of Paraselene actions.
    const indexParaseleneActions = (actionList) => {
        let actionIndex = {};
        actionList.forEach((action, index) => {
            actionIndex[getParaseleneActionCanonicalName(action)] = index;
        });
        return actionIndex;
    };

    // Return the Paraselene macro settings.
    const getParaseleneMacroSettings = (action) => {
        let settings = {};
        const lines = action.split('\n');
        if (!lines[1].startsWith('!# Settings:')) {
            return settings;
        }
        const settingsLine = lines[1].substring('!# Settings:'.length);
        settingsLine.split(',').forEach(setting => {
            const [key, value] = setting.split(':');
            settings[key.trim()] = value.trim();
        });
        return settings;
    }

    // Register event handlers.
    const registerEventHandlers = () => {
        on('chat:message', install);
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

})();  // ParaseleneInstaller

// Register the length of this script.
{
    // Set this to the number of lines following the "throw new Error('')" below.
    const numberOfLinesFromErrorToScriptEnd = 9;
    try {
        throw new Error('');  // Set numberOfLinesFromErrorToScriptEnd to the number of lines following this line.
    }
    catch (exception) {
        const reportedLineNumber = parseInt(exception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10);
        const offset = API_Meta.ParaseleneInstaller.offset;
        const lineCount = reportedLineNumber - offset + numberOfLinesFromErrorToScriptEnd;
        API_Meta.ParaseleneInstaller.lineCount = lineCount;
    }
}
