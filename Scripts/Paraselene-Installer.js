// Paraselene-Installer
// Update, remove, and install abilities and macros in the Paraselene ecosystem.
// Version 1.6.0

// Github:   https://github.com/neilluna
// By:       Neil Luna
// Contact:  https://app.roll20.net/users/280391/neil-luna

// Register the offset of the start of this script.
// eslint-disable-next-line no-var
var API_Meta = API_Meta || {};
API_Meta.ParaseleneInstaller = {
  offset: Number.MAX_SAFE_INTEGER,
  lineCount: -1,
  version: "1.6.0",
};
{
  const errorLineNumber = 20; // Set this to the line number of the "throw new Error('')" below.
  try {
    throw new Error(""); // Set errorLineNumber (above) to this line number.
  } catch (exeception) {
    const reportedLineNumber = parseInt(
      exeception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, "$1"),
      10,
    );
    const offset = reportedLineNumber - errorLineNumber;
    API_Meta.ParaseleneInstaller.offset = offset;
  }
}

// eslint-disable-next-line no-unused-vars
const ParaseleneInstaller = (() => {
  const scriptName = "Paraselene-Installer";
  const version = API_Meta.ParaseleneInstaller.version;
  const schemaVersion = "2.0.1";
  const scriptAuthor = "Neil Luna";

  // Convenience aliases for ParaseleneCommon.
  let pc = null;
  let Attribute = null;
  let Table = null;
  let Row = null;
  let Header = null;
  let Cell = null;
  let Link = null;
  let Span = null;

  // Log the version info.
  const versionInfo = () => {
    log(`-=> ${scriptName} - ${version} by ${scriptAuthor}`);
  };

  // Check the state schema version. Update the schema if necessary.
  const checkSchema = () => {
    if (
      !Object.prototype.hasOwnProperty.call(state, scriptName) ||
      state[scriptName].version !== schemaVersion
    ) {
      log(`  > Updating schema to version ${schemaVersion} <`);

      switch (state[scriptName] && state[scriptName].version) {
        case "1.0.0": // Migrate from 1.0.0 to 2.0.0.
          setStateToDefaults();
        // No break statement. This must fall through.

        case "2.0.0": // Migrate from 2.0.0 to 2.0.1.
          convertSchema200To201();
        // No break statement. This must fall through.

        case "UpdateSchemaVersion":
          state[scriptName].version = schemaVersion;
          break;

        default:
          setStateToDefaults();
          state[scriptName].version = schemaVersion;
          break;
      }
    }
  };

  // Set the state to the schema version 2.0.1 defaults.
  const setStateToDefaults = () => {
    state[scriptName] = {
      installedFeatures: {
        DynamicLightingTool: true,
        MapChange: true,
        SmartAOE: true,
        Teleport: true,
        TokenActions: true,
        TurnOrder: true,
      },
    };
  };

  // Convert the schema version from 2.0.0 to 2.0.1.
  const convertSchema200To201 = () => {
    delete state[scriptName].installedFeatures.ScriptCards;
    delete state[scriptName].installedFeatures.TokenMod;
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
    const requiredVersion = "2.0.0";
    if (
      !pc.compareVersions ||
      pc.compareVersions(pc.version, requiredVersion) < 0
    ) {
      log(
        `${scriptName}: Error: Paraselene-Common version ${pc.version} is not supported. ` +
          `Please update Paraselene-Common to version ${requiredVersion} or higher.`,
      );
      pc = null;
      return false;
    }

    // Set up the convenience aliases for ParaseleneCommon.
    Attribute = pc.HtmlAttribute;
    Table = pc.HtmlBorderedTable;
    Row = pc.HtmlBorderedTableRow;
    Header = pc.HtmlBorderedTableHeader;
    Cell = pc.HtmlBorderedTableCell;
    Link = pc.HtmlLink;
    Span = pc.HtmlSpan;

    return true;
  };

  // Paraselene ecosystem state keys.
  // const paraseleneStateKeys = [
  //     'Paraselene-Common',
  //     'Paraselene-Tools',
  //     'Paraselene-DnD5e',
  //     'Paraselene-Installer',
  // ];

  // Deprecated Paraselene ecosystem state keys.
  // const paraseleneDeprecatedStateKeys = [
  //     'Paraselene-Updater',
  // ];

  // ParaseleneDnD5e SmartAOE abilities.
  const dnd5eSmartAOEAbilities = [
    [
      "!# Paraselene-AddAOEAcidSplash",
      "!# https://www.dndbeyond.com/spells/acid-splash",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Acid Splash;Green;circle, float;5ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Acid-Splash" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEAuraOfProtection",
      "!# https://www.dndbeyond.com/sources/basic-rules/classes#AuraofProtection",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "--#reentrant|AOE Aura of Protection for @(selected|token_id)",
      "-->setupCardStandard|Aura of Protection",
      "",
      "--+Caster level?|" +
        "[rbutton]6-17::casterLevelSet;7.5[/rbutton]" +
        "[rbutton]18+::casterLevelSet;27.5[/rbutton]",
      "--X|",
      "",
      "--:casterLevelSet|",
      "-->showSmartAOENoWidth|" +
        "Hidden;Aura of Protection;Yellow;circle, float;[&reentryval]ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Aura-of-Protection" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEAuraOfPurity",
      "!# https://www.dndbeyond.com/spells/aura-of-purity",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Aura of Purity;Yellow;circle, float;27.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Aura-of-Purity" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEAuraOfVitality",
      "!# https://www.dndbeyond.com/spells/aura-of-vitality",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Aura of Vitality;Yellow;circle, float;27.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Aura-of-Vitality" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEBurningHands",
      "!# https://www.dndbeyond.com/spells/burning-hands",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Burning Hands;Red;5econe;15ft;AoEControlToken;nearest, face;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Burning-Hands" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOECallLightningCloud",
      "!# https://www.dndbeyond.com/spells/call-lightning",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Call Lightning Cloud;Grey;circle, float;60ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Call-Lightning-Cloud" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOECallLightningStrike",
      "!# https://www.dndbeyond.com/spells/call-lightning",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Call Lightning Strike;White;circle, float;5ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Call-Lightning-Strike" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOECloudkill",
      "!# https://www.dndbeyond.com/spells/cloudkill",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Cloudkill;Green;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Cloudkill" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOECloudOfDaggers",
      "!# https://www.dndbeyond.com/spells/cloud-of-daggers",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Cloud of Daggers;Orange;wall;5ft;AoEControlToken;nearest, face;5ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Cloud-of-Daggers" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEColorSpray",
      "!# https://www.dndbeyond.com/spells/color-spray",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Color Spray;Rose;5econe;15ft;AoEControlToken;nearest, face;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Color-Spray" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEConeOfCold",
      "!# https://www.dndbeyond.com/spells/cone-of-cold",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Cone of Cold;White;5econe;60ft;AoEControlToken;nearest, face;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Cone-of-Cold" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEConfusion",
      "!# https://www.dndbeyond.com/spells/confusion",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "--#reentrant|AOE Confusion for @(selected|token_id)",
      "-->setupCardStandard|Confusion",
      "",
      "--+Cast level?|" +
        "[rbutton]4::castLevelSet;10[/rbutton]" +
        "[rbutton]5::castLevelSet;15[/rbutton]" +
        "[rbutton]6::castLevelSet;20[/rbutton]" +
        "[rbutton]7::castLevelSet;25[/rbutton]" +
        "[rbutton]8::castLevelSet;30[/rbutton]" +
        "[rbutton]9::castLevelSet;35[/rbutton]",
      "--X|",
      "",
      "--:castLevelSet|",
      "-->showSmartAOENoWidth|" +
        "Hidden;Confusion;Violet;circle, float;[&reentryval]ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Confusion" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEControlWater",
      "!# https://www.dndbeyond.com/spells/control-water",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Control Water;Aquamarine;wall;100ft;AoEControlToken;nearest, face;100ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Control-Water" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEDestructiveWave",
      "!# https://www.dndbeyond.com/spells/destructive-wave",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Destructive Wave;Orange;circle, float;27.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Destructive-Wave" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEDetectEvilAndGood",
      "!# https://www.dndbeyond.com/spells/detect-evil-and-good",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Detect Evil and Good;Magenta;circle, float;27.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Detect-Evil-and-Good" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEDetectMagic",
      "!# https://www.dndbeyond.com/spells/detect-magic",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Detect Magic;Magenta;circle, float;27.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Detect-Magic" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEDragonsBreath",
      "!# https://www.dndbeyond.com/spells/dragons-breath",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Dragon.apostrophe.s Breath;Red;5econe;15ft;AoEControlToken;nearest, face;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Dragon's-Breath" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEEarthTremor",
      "!# https://www.dndbeyond.com/spells/earth-tremor",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Earth Tremor;Orange;circle, float;7.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Earth-Tremor" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEEntangle",
      "!# https://www.dndbeyond.com/spells/entangle",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Entangle;Green;wall;20ft;AoEControlToken;nearest, face;20ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Entangle" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEEruptingEarth",
      "!# https://www.dndbeyond.com/spells/erupting-earth",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Erupting Earth;Orange;wall;20ft;AoEControlToken;nearest, face;20ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Erupting-Earth" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEFireShield",
      "!# https://www.dndbeyond.com/spells/fire-shield",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Fire Shield;Red;circle, float;2.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Fire-Shield" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEFireball",
      "!# https://www.dndbeyond.com/spells/fireball",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Fireball;Red;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Fireball" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEFlameStrike",
      "!# https://www.dndbeyond.com/spells/flame-strike",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Flame Strike;Red;circle, float;10ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Flame-Strike" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEFlamingSphere",
      "!# https://www.dndbeyond.com/spells/flaming-sphere",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Flaming Sphere;Red;circle, float;5ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Flaming-Sphere" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEFogCloud",
      "!# https://www.dndbeyond.com/spells/fog-cloud",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "--#reentrant|AOE Fog Cloud for @(selected|token_id)",
      "-->setupCardStandard|Fog Cloud",
      "",
      "--+Cast level?|" +
        "[rbutton]1::castLevelSet;20[/rbutton]" +
        "[rbutton]2::castLevelSet;40[/rbutton]" +
        "[rbutton]3::castLevelSet;60[/rbutton]" +
        "[rbutton]4::castLevelSet;80[/rbutton]" +
        "[rbutton]5::castLevelSet;100[/rbutton]" +
        "[rbutton]6::castLevelSet;120[/rbutton]" +
        "[rbutton]7::castLevelSet;140[/rbutton]" +
        "[rbutton]8::castLevelSet;160[/rbutton]" +
        "[rbutton]9::castLevelSet;180[/rbutton]",
      "--X|",
      "",
      "--:castLevelSet|",
      "-->showSmartAOENoWidth|" +
        "Hidden;Fog Cloud;Grey;circle, float;[&reentryval]ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Fog-Cloud" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEGraspingVine",
      "!# https://www.dndbeyond.com/spells/grasping-vine",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Grasping Vine;Green;circle, float;30ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Grasping-Vine" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEGrease",
      "!# https://www.dndbeyond.com/spells/grease",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Grease;Grey;wall;10ft;AoEControlToken;nearest, face;10ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Grease" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEGuardianOfFaith",
      "!# https://www.dndbeyond.com/spells/guardian-of-faith",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Guardian of Faith;Yellow;circle, float;10ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Guardian-of-Faith" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEGustOfWind",
      "!# https://www.dndbeyond.com/spells/gust-of-wind",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Gust of Wind;Cyan;wall;60ft;AoEControlToken;nearest, face;10ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Gust-of-Wind" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEHallow",
      "!# https://www.dndbeyond.com/spells/hallow",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Hallow;Yellow;circle, float;60ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Hallow" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEHypnoticPattern",
      "!# https://www.dndbeyond.com/spells/hypnotic-pattern",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Hypnotic Pattern;Violet;wall;30ft;AoEControlToken;nearest, face;30ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Hypnotic-Pattern" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEIceStorm",
      "!# https://www.dndbeyond.com/spells/ice-storm",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Ice Storm;White;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Ice-Storm" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEInsectPlague",
      "!# https://www.dndbeyond.com/spells/insect-plague",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Insect Plague;Chartreuse;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Insect-Plague" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOELeomundsTinyHut",
      "!# https://www.dndbeyond.com/spells/leomunds-tiny-hut",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Leomund.apostrophe.s Tiny Hut;Blue;circle, float;10ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Leomund's-Tiny-Hut" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOELightningBolt",
      "!# https://www.dndbeyond.com/spells/lightning-bolt",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Lightning Bolt;White;wall;100ft;AoEControlToken;nearest, face;5ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Lightning-Bolt" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEMassCureWounds",
      "!# https://www.dndbeyond.com/spells/mass-cure-wounds",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Mass Cure Wounds;Yellow;circle, float;30ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Mass-Cure-Wounds" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEPasswall",
      "!# https://www.dndbeyond.com/spells/passwall",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "--#reentrant|AOE Passwall for @(selected|token_id)",
      "-->setupCardStandard|Passwall",
      "",
      "--+Length?|" +
        "[rbutton]1::lengthSet;1[/rbutton]" +
        "[rbutton]2::lengthSet;2[/rbutton]" +
        "[rbutton]3::lengthSet;3[/rbutton]" +
        "[rbutton]4::lengthSet;4[/rbutton]" +
        "[rbutton]5::lengthSet;5[/rbutton]" +
        "[rbutton]6::lengthSet;6[/rbutton]" +
        "[rbutton]7::lengthSet;7[/rbutton]" +
        "[rbutton]8::lengthSet;8[/rbutton]" +
        "[rbutton]9::lengthSet;9[/rbutton]" +
        "[rbutton]10::lengthSet;10[/rbutton]" +
        "[rbutton]11::lengthSet;11[/rbutton]" +
        "[rbutton]12::lengthSet;12[/rbutton]" +
        "[rbutton]13::lengthSet;13[/rbutton]" +
        "[rbutton]14::lengthSet;14[/rbutton]" +
        "[rbutton]15::lengthSet;15[/rbutton]" +
        "[rbutton]16::lengthSet;16[/rbutton]" +
        "[rbutton]17::lengthSet;17[/rbutton]" +
        "[rbutton]18::lengthSet;18[/rbutton]" +
        "[rbutton]19::lengthSet;19[/rbutton]" +
        "[rbutton]20::lengthSet;20[/rbutton]",
      "--X|",
      "",
      "--:lengthSet|",
      "--&length|[&reentryval]",
      "",
      "--+Width?|" +
        "[rbutton]1::widthSet;1[/rbutton]" +
        "[rbutton]2::widthSet;2[/rbutton]" +
        "[rbutton]3::widthSet;3[/rbutton]" +
        "[rbutton]4::widthSet;4[/rbutton]" +
        "[rbutton]5::widthSet;5[/rbutton]",
      "--X|",
      "",
      "--:widthSet|",
      "-->showSmartAOE|" +
        "Hidden;Passwall;Orange;wall;[&length]ft;AoEControlToken;nearest, face;[&reentryval]ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Passwall" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEPassWithoutTrace",
      "!# https://www.dndbeyond.com/spells/pass-without-trace",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Pass without Trace;Azure;circle, float;27.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Pass-without-Trace" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEShatter",
      "!# https://www.dndbeyond.com/spells/shatter",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Shatter;Orange;circle, float;10ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Shatter" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESickeningRadiance",
      "!# https://www.dndbeyond.com/spells/sickening-radiance",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Sickening Radiance;Green;circle, float;30ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Sickening-Radiance" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESilence",
      "!# https://www.dndbeyond.com/spells/silence",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Silence;Azure;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Silence" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESleep",
      "!# https://www.dndbeyond.com/spells/sleep",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Sleep;Azure;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Sleep" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESleetStorm",
      "!# https://www.dndbeyond.com/spells/sleet-storm",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Sleet Storm;White;circle, float;40ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Sleet-Storm" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESpiritGuardians",
      "!# https://www.dndbeyond.com/spells/spirit-guardians",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Spirit Guardians;Yellow;circle, float;12.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Spirit-Guardians" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESpiritShroud",
      "!# https://www.dndbeyond.com/spells/spirit-shroud",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Spirit Shroud;Yellow;circle, float;7.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Spirit-Shroud" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESwordBurst",
      "!# https://www.dndbeyond.com/spells/sword-burst",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Sword Burst;Orange;circle, float;2.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Sword-Burst" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOESynapticStatic",
      "!# https://www.dndbeyond.com/spells/synaptic-static",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Synaptic Static;Violet;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Synaptic-Static" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEThunderStep",
      "!# https://www.dndbeyond.com/spells/thunder-step",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Thunder Step;Orange;circle, float;7.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Thunder-Step" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEThunderclap",
      "!# https://www.dndbeyond.com/spells/thunderclap",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Thunderclap;Orange;circle, float;2.5ft;self;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Thunderclap" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEThunderwave",
      "!# https://www.dndbeyond.com/spells/thunderwave",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOE|" +
        "Hidden;Thunderwave;Orange;wall;15ft;AoEControlToken;nearest, face;15ft;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Thunderwave" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOETrajectory",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoRadiusNoWidth|" +
        "Hidden;Trajectory;Grey;line;AoEControlToken;nearest, face;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Trajectory" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEVitriolicSphere",
      "!# https://www.dndbeyond.com/spells/vitriolic-sphere",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Vitriolic Sphere;Green;circle, float;20ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Vitriolic-Sphere" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-AddAOEZoneOfTruth",
      "!# https://www.dndbeyond.com/spells/zone-of-truth",
      '!{& 0 fetch apilogic}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "+++ParaseleneDnD5e+++",
      "-->showSmartAOENoWidth|" +
        "Hidden;Zone of Truth;Azure;circle, float;15ft;AoEControlToken;center;" +
        "@(selected.token_name)",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Zone-of-Truth" +
        "{& end}",
    ].join("\n") + "\n",
  ];

  // ParaseleneDnD5e ScriptCards abilities.
  const dnd5eScriptCardsAbilities = [
    [
      "!# Paraselene-ChaosBolt",
      '!{& 0 fetch mulerget}{& if "@(selected.token_id[None])" != "None"}' +
        "script{{",
      "--#reentrant|Chaos Bolt from @(selected|character_id)",
      "",
      "--=criticalHitThreshold|" +
        "get.@(selected|character_id).CriticalHitSettings.ChaosBoltCriticalHitThreshold/get",
      "--=useVariantCriticalHitDamage|" +
        "get.@(selected|character_id).CriticalHitSettings.ChaosBoltUseVariantCriticalHitDamage/get",
      "",
      "--#emoteFontColor|#000",
      "--#emoteText|@(selected|character_name) casts a Chaos Bolt",
      "--#whisper|self",
      "",
      "--#noRollHighlight|noRollHighlight",
      "--#sourceToken|@(selected|token_id)",
      "--#title|Chaos Bolt",
      "",
      "--+Cast level?|" +
        "[rbutton]1::spellLevelSet;1[/rbutton]" +
        "[rbutton]2::spellLevelSet;2[/rbutton]" +
        "[rbutton]3::spellLevelSet;3[/rbutton]" +
        "[rbutton]4::spellLevelSet;4[/rbutton]" +
        "[rbutton]5::spellLevelSet;5[/rbutton]" +
        "[rbutton]6::spellLevelSet;6[/rbutton]" +
        "[rbutton]7::spellLevelSet;7[/rbutton]" +
        "[rbutton]8::spellLevelSet;8[/rbutton]" +
        "[rbutton]9::spellLevelSet;9[/rbutton]",
      "--X|",
      "",
      "--:spellLevelSet|",
      "--=castLevel|[&reentryval]",
      "--#whisper|",
      "",
      "--#leftsub|Range: 120 ft",
      "--#rightsub|Cast at level [$castLevel]",
      "",
      "--=spellSlots|[*@(selected|token_id):lvl[$castLevel]_slots_expended]",
      "--?[$spellSlots] -ge 1|enoughSpellSlots",
      "--+Warning|[r][#800][b]No level [$castLevel.Raw] spell slots[/b][/#][/r]",
      "--+|[hr]",
      "--:enoughSpellSlots|",
      "",
      "-->Attack|",
      "",
      "--?[$spellSlots] -le 0|skipDecSpellSlots",
      "--!a:@(selected|token_id)|lvl[$castLevel]_slots_expended:-=1",
      "--=spellSlots|[$spellSlots] - 1",
      "--+|[hr]",
      "--+Level [$castLevel.Raw] Spell Slots Remaining|[r][$spellSlots][/r]",
      "--:skipDecSpellSlots|",
      "--X|",
      "",
      "--:Attack|",
      "--=attackRoll1|1d20 + @(selected|spell_attack_bonus) [Spell]",
      "",
      "--&attackRoll1Text|[$attackRoll1]",
      "--?[$attackRoll1.Base] -gt 1|skipFumble1Coloring",
      "--&attackRoll1Text|[#800][$attackRoll1][/#]",
      "--:skipFumble1Coloring|",
      "--?[$attackRoll1.Base] -lt [$criticalHitThreshold]|skipCrit1Coloring",
      "--&attackRoll1Text|[#080][$attackRoll1][/#]",
      "--:skipCrit1Coloring|",
      "",
      "--=attackRoll2|1d20 + @(selected|spell_attack_bonus) [Spell]",
      "",
      "--&attackRoll2Text|[$attackRoll2]",
      "--?[$attackRoll2.Base] -gt 1|skipFumble2Coloring",
      "--&attackRoll2Text|[#800][$attackRoll2][/#]",
      "--:skipFumble2Coloring|",
      "--?[$attackRoll2.Base] -lt [$criticalHitThreshold]|skipCrit2Coloring",
      "--&attackRoll2Text|[#080][$attackRoll2][/#]",
      "--:skipCrit2Coloring|",
      "--+Ranged Attack|[r][&attackRoll1Text] | [&attackRoll2Text][/r]",
      "",
      "--=dmgRoll1|1d8",
      "--=dmgRoll2|1d8",
      "",
      "--?[$castLevel] -gt 1|hlDmg",
      "--=dmgRoll3|1d6",
      "--^dmgDone|",
      "--:hlDmg|",
      "--=hlDmgDieCount|[$castLevel] - 1",
      "--=dmgRoll3|1d6 + [$hlDmgDieCount]d6 [Level [$castLevel]]",
      "--:dmgDone|",
      "",
      "--=dmg|[$dmgRoll1] + [$dmgRoll2] + [$dmgRoll3]",
      "--&dmgRollText|[$dmgRoll1]+[$dmgRoll2]+[$dmgRoll3]",
      "--?[$dmgRoll1.Base] -ne [$dmgRoll2.Base]|skipHopColoring",
      "--&dmgRollText|[#08F][$dmgRoll1][/#]+[#08F][$dmgRoll2][/#]+[$dmgRoll3]",
      "--:skipHopColoring|",
      "--+Damage|[r][&dmgRollText]=[$dmg][/r]",
      "",
      "--?[$attackRoll1.Base] -lt [$criticalHitThreshold] " +
        "-and [$attackRoll2.Base] -lt [$criticalHitThreshold]|skipCrit",
      "--?[$useVariantCriticalHitDamage] -eq 1|calcVarCrit",
      "--?[$castLevel] -gt 1|calcHlStdCrit",
      "--=critDmg|2d8 + 1d6",
      "--^calcCritDone|",
      "--:calcHlStdCrit|",
      "--=hlDmgDieCount|[$castLevel] - 1",
      "--=critDmg|2d8 + 1d6 + [$hlDmgDieCount]d6 [Level [$castLevel]]",
      "--^calcCritDone|",
      "--:calcVarCrit|",
      "--?[$castLevel] -gt 1|calcHlVarCrit",
      "--=critDmg|1d8 + 8 [Max] + 1d6",
      "--^calcCritDone|",
      "--:calcHlVarCrit|",
      "--=hlDmgDieCount|[$castLevel] - 1",
      "--=critDmg|1d8 + 8 [Max] + 1d6 + [$hlDmgDieCount]d6 [Level [$castLevel]]",
      "--^calcCritDone|",
      "--:calcCritDone|",
      "--+Critical Hit Damage|[r][$critDmg][/r]",
      "--:skipCrit|",
      "",
      "--c[$dmgRoll1]" +
        "|1:&dmgType1;Acid" +
        "|2:&dmgType1;Cold" +
        "|3:&dmgType1;Fire" +
        "|4:&dmgType1;Force" +
        "|5:&dmgType1;Lightning" +
        "|6:&dmgType1;Poison" +
        "|7:&dmgType1;Psychic" +
        "|8:&dmgType1;Thunder",
      "--c[$dmgRoll2]" +
        "|1:&dmgType2;Acid" +
        "|2:&dmgType2;Cold" +
        "|3:&dmgType2;Fire" +
        "|4:&dmgType2;Force" +
        "|5:&dmgType2;Lightning" +
        "|6:&dmgType2;Poison" +
        "|7:&dmgType2;Psychic" +
        "|8:&dmgType2;Thunder",
      "",
      "--?[$dmgRoll1] -ne [$dmgRoll2]|skipHop",
      "--+Damage Type|[r][b][i][&dmgType1][/i][/b][/r]",
      "--+|[hr]",
      "--+|[c][b]Chaotic energy leaps to a new target within 30 feet![/b][/c]",
      "--+|[hr]",
      "-->Attack|",
      "--^hopDone|",
      "--:skipHop|",
      "--+Damage Type|[r][b]Either [i][&dmgType1][/i] or [i][&dmgType2][/i][/b][/r]",
      "--:hopDone|",
      "--<|",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Chaos-Bolt" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-MagicMissile",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' + "script{{",
      "--#reentrant|Magic Missile from @(selected|character_id)",
      "",
      "--#emoteFontColor|#000",
      "--#emoteText|@(selected|character_name) casts a Magic Missile",
      "--#whisper|self",
      "",
      "--#noRollHighlight|noRollHighlight",
      "--#sourceToken|@(selected|token_id)",
      "--#title|Magic Missile",
      "",
      "--+Cast level?|" +
        "[rbutton]1::spellLevelSet;1[/rbutton]" +
        "[rbutton]2::spellLevelSet;2[/rbutton]" +
        "[rbutton]3::spellLevelSet;3[/rbutton]" +
        "[rbutton]4::spellLevelSet;4[/rbutton]" +
        "[rbutton]5::spellLevelSet;5[/rbutton]" +
        "[rbutton]6::spellLevelSet;6[/rbutton]" +
        "[rbutton]7::spellLevelSet;7[/rbutton]" +
        "[rbutton]8::spellLevelSet;8[/rbutton]" +
        "[rbutton]9::spellLevelSet;9[/rbutton]",
      "--X|",
      "",
      "--:spellLevelSet|",
      "--=castLevel|[&reentryval]",
      "--#whisper|",
      "",
      "--#leftsub|Range: 120 ft",
      "--#rightsub|Cast at level [$castLevel]",
      "",
      "--=spellSlots|[*@(selected|token_id):lvl[$castLevel]_slots_expended]",
      "--?[$spellSlots] -ge 1|enoughSpellSlots",
      "--+Warning|[r][#800][b]No level [$castLevel.Raw] spell slots[/b][/#][/r]",
      "--+|[hr]",
      "--:enoughSpellSlots|",
      "",
      "--=numberOfDarts|[$castLevel] + 2",
      "--=dartCounter|1",
      "--:dartLoop|",
      "--=dmg|1d4 + 1",
      "--+Dart [$dartCounter.Raw] Damage|[r][$dmg][/r]",
      "--=dartCounter|[$dartCounter] + 1",
      "--?[$dartCounter] -le [$numberOfDarts]|dartLoop",
      "--+Damage Type|[r][b][i]Force[/i][/b][/r]",
      "",
      "--?[$spellSlots] -le 0|skipDecSpellSlots",
      "--!a:@(selected|token_id)|lvl[$castLevel]_slots_expended:-=1",
      "--=spellSlots|[$spellSlots] - 1",
      "--+|[hr]",
      "--+Level [$castLevel.Raw] Spell Slots Remaining|[r][$spellSlots][/r]",
      "--:skipDecSpellSlots|",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Magic-Missile" +
        "{& end}",
    ].join("\n") + "\n",
  ];

  // ParaseleneDnD5e TokenMod abilities.
  const dnd5eTokenModAbilities = [
    [
      "!# Paraselene-SetTokenDefaults",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' +
        "token-mod " +
        "--on " +
        "showname " +
        "showplayers_name " +
        "showplayers_bar1 " +
        "--off " +
        "playersedit_name " +
        "showplayers_aura1 " +
        "showplayers_aura2 " +
        "playersedit_aura1 " +
        "playersedit_aura2 " +
        "showplayers_bar2 " +
        "showplayers_bar3 " +
        "playersedit_bar1 " +
        "playersedit_bar2 " +
        "playersedit_bar3" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Set-Token-Defaults" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-SetTokenLight",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' + "script{{",
      "--#reentrant|Set token light for @(selected|token_id)",
      "",
      "--#sourceToken|@(selected|token_id)",
      "--#emoteState|hidden",
      "--#title|Set Token Light",
      "--#whisper|self",
      "",
      "--+[rbutton]Select::setNone;None[/rbutton]|None",
      "--+[rbutton]Select::setBullseyeLantern;Bullseye Lantern[/rbutton]|Bullseye Lantern",
      "--+[rbutton]Select::setCandle;Candle[/rbutton]|Candle",
      "--+[rbutton]Select::setCrownOfStars1Mote;Crown of Stars (1-3 Motes)[/rbutton]|" +
        "Crown of Stars (1-3 Motes)",
      "--+[rbutton]Select::setCrownOfStars4Motes;Crown of Stars (4+ Motes)[/rbutton]|" +
        "Crown of Stars (4+ Motes)",
      "--+[rbutton]Select::setDancingLights;Dancing Lights[/rbutton]|Dancing Lights",
      "--+[rbutton]Select::setDaylightSpell;Daylight Spell[/rbutton]|Daylight Spell",
      "--+[rbutton]Select::setFaerieFire;Faerie Fire[/rbutton]|Faerie Fire",
      "--+[rbutton]Select::setGemOfBrightness;Gem of Brightness[/rbutton]|Gem of Brightness",
      "--+[rbutton]Select::setHoodedLantern;Hooded Lantern[/rbutton]|Hooded Lantern",
      "--+[rbutton]Select::setLamp;Lamp[/rbutton]|Lamp",
      "--+[rbutton]Select::setLightCantrip;Light Cantrip[/rbutton]|Light Cantrip",
      "--+[rbutton]Select::setSpot5ft;Spot 5ft[/rbutton]|Spot 5ft",
      "--+[rbutton]Select::setSunblade10;Sun Blade 10ft[/rbutton]|Sun Blade 10ft",
      "--+[rbutton]Select::setSunblade15;Sun Blade 15ft[/rbutton]|Sun Blade 15ft",
      "--+[rbutton]Select::setSunblade20;Sun Blade 20ft[/rbutton]|Sun Blade 20ft",
      "--+[rbutton]Select::setSunblade25;Sun Blade 25ft[/rbutton]|Sun Blade 25ft",
      "--+[rbutton]Select::setSunblade30;Sun Blade 30ft[/rbutton]|Sun Blade 30ft",
      "--+[rbutton]Select::setTorch;Torch[/rbutton]|Torch",
      "--X|",
      "",
      "--:setNone|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|off",
      "--&emitsLowLight|off",
      "--&brightLightDistance|0",
      "--&lowLightDistance|0",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setBullseyeLantern|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|60",
      "--&lowLightDistance|60",
      "--&lightAngle|90",
      "--^setTokenLight|",
      "",
      "--:setCandle|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|2",
      "--&lowLightDistance|5",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setCrownOfStars1Mote|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|off",
      "--&emitsLowLight|on",
      "--&brightLightDistance|0",
      "--&lowLightDistance|30",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setCrownOfStars4Motes|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|30",
      "--&lowLightDistance|30",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setDancingLights|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|off",
      "--&emitsLowLight|on",
      "--&brightLightDistance|0",
      "--&lowLightDistance|10",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setDaylightSpell|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|60",
      "--&lowLightDistance|60",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setFaerieFire|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|off",
      "--&emitsLowLight|on",
      "--&brightLightDistance|0",
      "--&lowLightDistance|10",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setGemOfBrightness|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|30",
      "--&lowLightDistance|30",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setHoodedLantern|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|30",
      "--&lowLightDistance|30",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setLamp|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|15",
      "--&lowLightDistance|15",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setLightCantrip|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|20",
      "--&lowLightDistance|20",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setSpot5ft|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|5",
      "--&lowLightDistance|0",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setSunblade10|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|10",
      "--&lowLightDistance|10",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setSunblade1st15|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|15",
      "--&lowLightDistance|15",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setSunblade20|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|20",
      "--&lowLightDistance|20",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setSunblade25|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|25",
      "--&lowLightDistance|25",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setSunblade30|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|30",
      "--&lowLightDistance|30",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setTorch|",
      "--&hasBrightLightVision|on",
      "--&emitsBrightLight|on",
      "--&emitsLowLight|on",
      "--&brightLightDistance|20",
      "--&lowLightDistance|20",
      "--&lightAngle|360",
      "--^setTokenLight|",
      "",
      "--:setTokenLight|",
      "--+|[c][b]Set to [&reentryval][/b][/c]",
      "--@token-mod|_ignore-selected _ids @(selected|token_id) " +
        "_set " +
        "has_bright_light_vision|[&hasBrightLightVision] " +
        "emits_bright_light|[&emitsBrightLight] " +
        "emits_low_light|[&emitsLowLight] " +
        "bright_light_distance|[&brightLightDistance] " +
        "low_light_distance|[&lowLightDistance] " +
        "light_angle|[&lightAngle]",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Set-Token-Light" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-SetTokenVision",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' + "script{{",
      "--#reentrant|Set token vision for @(selected|token_id)",
      "",
      "--#sourceToken|@(selected|token_id)",
      "--#emoteState|hidden",
      "--#title|Set Token Vision",
      "--#whisper|self",
      "",
      "--+[rbutton]Select::setNormal;Normal (Human)[/rbutton]|Normal (Human)",
      "--+[rbutton]Select::setBlind;Blind[/rbutton]|Blind",
      "--+[rbutton]Select::setBlindFighting;Blind Fighting[/rbutton]|Blind Fighting",
      "--+[rbutton]Select::setDarkvision60;Darkvision 60ft[/rbutton]|Darkvision 60ft",
      "--+[rbutton]Select::setDarkvision90;Darkvision 90ft[/rbutton]|Darkvision 90ft",
      "--+[rbutton]Select::setDarkvision120;Darkvision 120ft[/rbutton]|Darkvision 120ft",
      "--+[rbutton]Select::setDarkvision300;Darkvision 300ft[/rbutton]|Darkvision 300ft",
      "--X|",
      "",
      "--:setNormal|",
      "--&hasBrightLightVision|on",
      "--&hasNightVision|off",
      "--&nightVisionDistance|0",
      "--&lightAngle|360",
      "--&night_vision_effect|none",
      "--^setTokenVision|",
      "",
      "--:setBlind|",
      "--&hasBrightLightVision|off",
      "--&hasNightVision|off",
      "--&nightVisionDistance|0",
      "--&lightAngle|360",
      "--&night_vision_effect|none",
      "--^setTokenVision|",
      "",
      "--:setBlindFighting|",
      "--&hasBrightLightVision|on",
      "--&hasNightVision|on",
      "--&nightVisionDistance|10",
      "--&lightAngle|360",
      "--&night_vision_effect|none",
      "--^setTokenVision|",
      "",
      "--:setDarkvision60|",
      "--&hasBrightLightVision|on",
      "--&hasNightVision|on",
      "--&nightVisionDistance|60",
      "--&lightAngle|360",
      "--&night_vision_effect|nocturnal",
      "--^setTokenVision|",
      "",
      "--:setDarkvision90|",
      "--&hasBrightLightVision|on",
      "--&hasNightVision|on",
      "--&nightVisionDistance|90",
      "--&lightAngle|360",
      "--&night_vision_effect|nocturnal",
      "--^setTokenVision|",
      "",
      "--:setDarkvision120|",
      "--&hasBrightLightVision|on",
      "--&hasNightVision|on",
      "--&nightVisionDistance|120",
      "--&lightAngle|360",
      "--&night_vision_effect|nocturnal",
      "--^setTokenVision|",
      "",
      "--:setDarkvision300|",
      "--&hasBrightLightVision|on",
      "--&hasNightVision|on",
      "--&nightVisionDistance|300",
      "--&lightAngle|360",
      "--&night_vision_effect|nocturnal",
      "--^setTokenVision|",
      "",
      "--:setTokenVision|",
      "--+|[c][b]Set to [&reentryval][/b][/c]",
      "--@token-mod|_ignore-selected _ids @(selected|token_id) " +
        "_set " +
        "has_bright_light_vision|[&hasBrightLightVision] " +
        "has_night_vision|[&hasNightVision] " +
        "night_vision_distance|[&nightVisionDistance] " +
        "light_angle|[&lightAngle] " +
        "night_vision_effect|[&night_vision_effect]",
      "}}" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Set-Token-Vision" +
        "{& end}",
    ].join("\n") + "\n",
  ];

  // ParaseleneTools TurnOrder abilities.
  const toolsTurnOrderAbilities = [
    [
      "!# Paraselene-ManageTurnOrder",
      "/w gm &{template:traits} {{name=Manage Turn Order}} {{description=" +
        "**Announcements**",
      "[Toggle rounds](!tm toggle-announce)",
      "[Toggle turns](!tm toggle-announce-turn)",
      "[Toggle include player names](!tm toggle-announce-player)",
      "**Preparation**",
      "[Set round counter](!tm reset " +
        "&#63;{Set round value to|0}) " +
        "&lbrack;value&rbrack;", // [value]
      "[Add down counter](!act -1 " +
        "&#63;{Start counter at|10} " +
        "--index 0 " +
        "--&#63;{Counter name}) " +
        "&lbrack;value&rbrack; &lbrack;name&rbrack;", // [value] [name]
      "**Window**",
      "[Toggle visibilty](!group-init --toggle-turnorder)",
      "[Sort](!group-init --sort)",
      "[Clear and Close](!group-init --clear)",
      "}}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-ManageTurnOrderStack",
      "/w gm &{template:traits} {{name=Manage Turn Order Stack}} {{description=" +
        "**Operations**",
      "[List](!group-init --stack list)",
      "[Push to last](!group-init --stack push) " +
        "[with label](!group-init --stack push &#63;{Stack item label})",
      "[Pop from last](!group-init --stack pop)",
      "[Pop merge from last](!group-init --stack merge)",
      "[Push copy to last](!group-init --stack copy) " +
        "[with label](!group-init --stack copy &#63;{Stack item label})",
      "[Copy from first](!group-init --stack apply)",
      "[Copy merge from first](!group-init --stack apply-merge)",
      "[Swap with first](!group-init --stack swap) " +
        "[with label](!group-init --stack swap &#63;{Stack item label})",
      "[Swap with last](!group-init --stack tail-swap) " +
        "[with label](!group-init --stack tail-swap &#63;{Stack item label})",
      "[Rotate into first](!group-init --stack reverse-rotate) " +
        "[with label](!group-init --stack reverse-rotate &#63;{Stack item label})",
      "[Rotate into last](!group-init --stack rotate) " +
        "[with label](!group-init --stack rotate &#63;{Stack item label})",
      "[Clear](!group-init --stack clear)",
      "**Stack Tips**",
      '- To rotate the stack upward, do a "Rotate into last", then a "Swap with last".',
      '- To rotate the stack downward, do a "Rotate into first", then a "Swap with first".',
      "}}",
    ].join("\n") + "\n",
  ];

  // ParaseleneTools SmartAOE macros.
  const smartAOEMacros = [
    [
      "!# Paraselene-Remove-AOE-Pattern",
      "!# Settings: Token Action: Yes, Visibility: All Players",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' +
        "smartremove" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Remove-AOE-Pattern" +
        "{& end}",
    ].join("\n") + "\n",
  ];

  // ParaseleneTools MapChange macros.
  const mapChangeMacros = [
    [
      "!# Paraselene-Change-Map",
      "!# Settings: Visibility: All Players",
      "!mc menu --show public",
    ].join("\n") + "\n",
    ["!# Paraselene-Change-Map-GM-Only", "!mc menu"].join("\n") + "\n",
  ];

  // ParaseleneTools TokenMod macros.
  const tokenModMacros = [
    [
      "!# Paraselene-Clear-Token-Status",
      "!# Settings: Token Action: Yes",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' +
        "token-mod --set statusmarkers#=" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Clear-Token-Status" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Kill-Token",
      "!# Settings: Token Action: Yes",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' +
        "token-mod --order top --set layer#map statusmarkers#dead" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Kill-Token" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Set-Token-Defaults",
      "!# Settings: Token Action: Yes",
      "%{ParaseleneDnD5e|SetTokenDefaults}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Set-Token-Light",
      "!# Settings: Token Action: Yes",
      "%{ParaseleneDnD5e|SetTokenLight}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Set-Token-Vision",
      "!# Settings: Token Action: Yes",
      "%{ParaseleneDnD5e|SetTokenVision}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Toggle-Token-Hunters-Mark",
      "!# Settings: Token Action: Yes",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' +
        "token-mod --set statusmarkers#!archery-target" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Toggle-Token-Hunters-Mark" +
        "{& end}",
    ].join("\n") + "\n",
  ];

  // ParaseleneTools DynamicLightingTool macros.
  const dynamicLightingToolMacros = [
    ["!# Paraselene-Dynamic-Lighting-Tool", "!dltool"].join("\n") + "\n",
  ];

  // ParaseleneTools TurnOrder macros.
  const turnOrderMacros = [
    [
      "!# Paraselene-Manage-Turn-Order",
      "%{ParaseleneTools|ManageTurnOrder}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Manage-Turn-Order-Stack",
      "%{ParaseleneTools|ManageTurnOrderStack}",
    ].join("\n") + "\n",
  ];

  // ParaseleneTools Teleport macros.
  const teleportMacros = [
    ["!# Paraselene-Teleport-Menu", "!teleport --menu"].join("\n") + "\n",
  ];

  // ParaseleneTools TokenAction macros.
  const tokenActionMacros = [
    [
      "!# Paraselene-Add-Token-Actions",
      "!# Settings: Token Action: Yes",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' +
        "sortta" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Add-Token-Actions" +
        "{& end}",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Remove-Token-Actions",
      "!# Settings: Token Action: Yes",
      '!{& 0 fetch}{& if "@(selected.token_id[None])" != "None"}' +
        "deleteta" +
        "{& else}" +
        "Paraselene-Tools-Whisper-Token-Not-Selected --speakAs Remove-Token-Actions" +
        "{& end}",
    ].join("\n") + "\n",
  ];

  // Paraselene core macros. Always present.
  const paraseleneCoreMacros = [
    [
      "!# Paraselene-Get-Token-Info",
      "!# Settings: Token Action: Yes",
      "!Paraselene-Tools-Get-Token-Info --speakAs Get-Token-Info",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Install",
      "!Paraselene-Installer-Install --speakAs Install",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Ping-Character",
      "!# Settings: Visibility: All Players",
      "!Paraselene-Tools-Ping-Character --speakAs Ping-Character",
    ].join("\n") + "\n",
    [
      "!# Paraselene-Rotate-Token",
      "!# Settings: Token Action: Yes, Visibility: All Players",
      "!Paraselene-Tools-Rotate-Token --speakAs Rotate-Token",
    ].join("\n") + "\n",
  ];

  // ParaseleneDnD5e ScriptCards Library SmartAOE functions.
  const smartAOELibraryFunctions = [
    [
      "--:setupCardStandard|title",
      "--#emoteState|hidden",
      "--&title|[%1%]",
      "--#title|AOE for [&title(replaceall,.apostrophe.,')]",
      "--#whisper|self",
      "--<|",
    ].join("\n") + "\n",
    [
      "--:setupCardHidden|",
      "--#emoteState|hidden",
      "--#hideCard|1",
      "--#whisper|self",
      "--<|",
    ].join("\n") + "\n",
    [
      "--:getColorCode|targertVariable;colorName",
      "--c[%2%]" +
        "|Aquamarine:&[%1%];#00FF88" +
        "|Azure:&[%1%];#0088FF" +
        "|Black:&[%1%];#000000" +
        "|Blue:&[%1%];#0000FF" +
        "|Chartreuse:&[%1%];#88FF00" +
        "|Cyan:&[%1%];#00FFFF" +
        "|Green:&[%1%];#00FF00" +
        "|Grey:&[%1%];#888888" +
        "|Magenta:&[%1%];#FF00FF" +
        "|Orange:&[%1%];#FF8800" +
        "|Red:&[%1%];#FF0000" +
        "|Rose:&[%1%];#FF0088" +
        "|Violet:&[%1%];#8800FF" +
        "|White:&[%1%];#FFFFFF" +
        "|Yellow:&[%1%];#FFFF00",
      "--<|",
    ].join("\n") + "\n",
    [
      "--:showSmartAOE|cardType;title;colorName;type;radius;controlTokenName;origin;width;characterName",
      "-->setupCard[%1%]|[%2%]",
      "-->getColorCode|colorCode;[%3%]",
      "--&title|[%2%]",
      "--@smartaoe|" +
        "_playerID|[&SendingPlayerID] " +
        "_selectedID|@(selected.token_id) " +
        "_aoeColor|[&colorCode]50 " +
        "_aoeOutlineColor|#00000050 " +
        "_aoeType|[%4%] " +
        "_forceIntersection|0 " +
        "_mingridarea|0.1 " +
        "_radius|[%5%] " +
        "_controlTokName|[%6%] " +
        "_origin|[%7%] " +
        "_width|[%8%] " +
        "_tooltip|[%9%] - [&title(replaceall,.apostrophe.,')]",
      "--<|",
    ].join("\n") + "\n",
    [
      "--:showSmartAOENoWidth|cardType;title;colorName;type;radius;controlTokenName;origin;characterName",
      "-->setupCard[%1%]|[%2%]",
      "-->getColorCode|colorCode;[%3%]",
      "--&title|[%2%]",
      "--@smartaoe|" +
        "_playerID|[&SendingPlayerID] " +
        "_selectedID|@(selected.token_id) " +
        "_aoeColor|[&colorCode]50 " +
        "_aoeOutlineColor|#00000050 " +
        "_aoeType|[%4%] " +
        "_forceIntersection|0 " +
        "_mingridarea|0.1 " +
        "_radius|[%5%] " +
        "_controlTokName|[%6%] " +
        "_origin|[%7%] " +
        "_tooltip|[%8%] - [&title(replaceall,.apostrophe.,')]",
      "--<|",
    ].join("\n") + "\n",
    [
      "--:showSmartAOENoRadiusNoWidth|cardType;title;colorName;type;controlTokenName;origin;characterName",
      "-->setupCard[%1%]|[%2%]",
      "-->getColorCode|colorCode;[%3%]",
      "--&title|[%2%]",
      "--@smartaoe|" +
        "_playerID|[&SendingPlayerID] " +
        "_selectedID|@(selected.token_id) " +
        "_aoeColor|[&colorCode]50 " +
        "_aoeOutlineColor|#00000050 " +
        "_aoeType|[%4%] " +
        "_forceIntersection|0 " +
        "_mingridarea|0.1 " +
        "_controlTokName|[%5%] " +
        "_origin|[%6%] " +
        "_tooltip|[%7%] - [&title(replaceall,.apostrophe.,')]",
      "--<|",
    ].join("\n") + "\n",
  ];

  // Update, remove, and install abilities and macros.
  const install = (msg) => {
    const commandName = `${scriptName}-Install`;
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != `!${commandName}`) {
      return;
    }

    if (!isParseleneCommonLoaded()) {
      return;
    }

    const speakAs = pc.extractCommandLineOption(args, "--speakAs", commandName);
    const playerId = msg.playerid;

    const serializedChoices = serializeChoices(
      state[scriptName].installedFeatures,
    );

    sendChat(
      speakAs,
      `!${scriptName}-Install-Menu-API --speakAs ${speakAs} ${playerId} ${serializedChoices}`,
    );
  };

  // Convert a feature choice object into a string of feature choices.
  const serializeChoices = (choices) => {
    return (
      `${choices.DynamicLightingTool} ` +
      `${choices.MapChange} ` +
      `${choices.SmartAOE} ` +
      `${choices.Teleport} ` +
      `${choices.TokenActions} ` +
      `${choices.TurnOrder}`
    );
  };

  // Convert a string of feature choices to a feature choice object.
  const deserializeChoices = (args, startIndex) => {
    return {
      DynamicLightingTool: args[startIndex] === "true",
      MapChange: args[startIndex + 1] === "true",
      SmartAOE: args[startIndex + 2] === "true",
      Teleport: args[startIndex + 3] === "true",
      TokenActions: args[startIndex + 4] === "true",
      TurnOrder: args[startIndex + 5] === "true",
    };
  };

  // Present the installation menu.
  const installMenuAPI = (msg) => {
    const commandName = `${scriptName}-Install-Menu-API`;
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != `!${commandName}`) {
      return;
    }

    if (!isParseleneCommonLoaded()) {
      return;
    }

    const speakAs = pc.extractCommandLineOption(args, "--speakAs", commandName);
    const playerId = args[1];
    const player = getObj("player", playerId);
    const playerName = player.get("displayname");
    const choices = deserializeChoices(args, 2);

    // Feature choices.
    const installedFeatures = state[scriptName].installedFeatures;

    const alert = `<br/>${new Span("Pending", "color: yellow").render()}`;
    const alerts = {
      DynamicLightingTool:
        choices.DynamicLightingTool !== installedFeatures.DynamicLightingTool
          ? alert
          : "",
      MapChange: choices.MapChange !== installedFeatures.MapChange ? alert : "",
      SmartAOE: choices.SmartAOE !== installedFeatures.SmartAOE ? alert : "",
      Teleport: choices.Teleport !== installedFeatures.Teleport ? alert : "",
      TokenActions:
        choices.TokenActions !== installedFeatures.TokenActions ? alert : "",
      TurnOrder: choices.TurnOrder !== installedFeatures.TurnOrder ? alert : "",
    };

    const dynamicLightingToolSummary =
      'Include a macro to invoke the "Dynamic Lighting Tool".<br/>' +
      'Example: "Dynamic-Lighting-Tool".';
    const mapChangeSummary =
      "Include macros that allow the players to change maps themselves, " +
      "and a macro for the GM to easily manage which maps the players are on.<br/>" +
      'Examples: "Change-Map" and "Change-Map-GM-Only".';
    const smartAOESummary =
      "Include abilities and macros for the AOE pattern helpers.<br/>" +
      'Examples: "Add-AOE-Pattern" and "Remove-AOE-Pattern".';
    const teleportSummary =
      'Include a macro to invoke the GM\'s "Teleport" menu tool.<br/>' +
      'Example: "Teleport-Menu".';
    const tokenActionsSummary =
      'Include macros to add and remove token actions for the "Actions" of NPCs.<br/>' +
      'Examples: "Add-Token-Actions" and "Remove-Token-Actions".';
    const turnOrderSummary =
      "Include macros to easily manage the turn order.<br/>" +
      'Examples: "Manage-Turn-Order" and "Manage-Turn-Order-Stack".';

    const serializedChoices = serializeChoices(choices);

    const cellStyle = "padding-left: 5px; padding-right: 5px;";
    const switchCellStyle = cellStyle + " text-align: center;";
    const table = new Table()
      .add(
        new Row().add(
          new Cell(
            new Span("Installation Features", "font-weight: bold").render() +
              "<br/>" +
              "Turn on which features you want installed. " +
              "Turn off which features you want removed.",
            cellStyle + " text-align: center;",
          ).addAttribute(new Attribute("colspan", "2")),
        ),
      )
      .add(
        new Row()
          .add(
            new Cell(
              new Span("Dynamic Lighting Tool", "font-weight: bold").render() +
                "<br/>" +
                dynamicLightingToolSummary,
              cellStyle,
            ),
          )
          .add(
            new Cell(
              new Link(
                `!${scriptName}-Toggle-Feature-API --speakAs ${speakAs} ${playerId} DynamicLightingTool ` +
                  serializedChoices,
                `${choices.DynamicLightingTool ? "On" : "Off"}`,
              ).render() + alerts.DynamicLightingTool,
              switchCellStyle,
            ),
          ),
      )
      .add(
        new Row()
          .add(
            new Cell(
              new Span("Map Change", "font-weight: bold").render() +
                "<br/>" +
                mapChangeSummary,
              cellStyle,
            ),
          )
          .add(
            new Cell(
              new Link(
                `!${scriptName}-Toggle-Feature-API --speakAs ${speakAs} ${playerId} MapChange ` +
                  serializedChoices,
                `${choices.MapChange ? "On" : "Off"}`,
              ).render() + alerts.MapChange,
              switchCellStyle,
            ),
          ),
      )
      .add(
        new Row()
          .add(
            new Cell(
              new Span("Smart AOE", "font-weight: bold").render() +
                "<br/>" +
                smartAOESummary,
              cellStyle,
            ),
          )
          .add(
            new Cell(
              new Link(
                `!${scriptName}-Toggle-Feature-API --speakAs ${speakAs} ${playerId} SmartAOE ` +
                  serializedChoices,
                `${choices.SmartAOE ? "On" : "Off"}`,
              ).render() + alerts.SmartAOE,
              switchCellStyle,
            ),
          ),
      )
      .add(
        new Row()
          .add(
            new Cell(
              new Span("Teleport", "font-weight: bold").render() +
                "<br/>" +
                teleportSummary,
              cellStyle,
            ),
          )
          .add(
            new Cell(
              new Link(
                `!${scriptName}-Toggle-Feature-API --speakAs ${speakAs} ${playerId} Teleport ` +
                  serializedChoices,
                `${choices.Teleport ? "On" : "Off"}`,
              ).render() + alerts.Teleport,
              switchCellStyle,
            ),
          ),
      )
      .add(
        new Row()
          .add(
            new Cell(
              new Span("Token Actions", "font-weight: bold").render() +
                "<br/>" +
                tokenActionsSummary,
              cellStyle,
            ),
          )
          .add(
            new Cell(
              new Link(
                `!${scriptName}-Toggle-Feature-API --speakAs ${speakAs} ${playerId} TokenActions ` +
                  serializedChoices,
                `${choices.TokenActions ? "On" : "Off"}`,
              ).render() + alerts.TokenActions,
              switchCellStyle,
            ),
          ),
      )
      .add(
        new Row()
          .add(
            new Cell(
              new Span("Turn Order", "font-weight: bold").render() +
                "<br/>" +
                turnOrderSummary,
              cellStyle,
            ),
          )
          .add(
            new Cell(
              new Link(
                `!${scriptName}-Toggle-Feature-API --speakAs ${speakAs} ${playerId} TurnOrder ` +
                  serializedChoices,
                `${choices.TurnOrder ? "On" : "Off"}`,
              ).render() + alerts.TurnOrder,
              switchCellStyle,
            ),
          ),
      )
      .add(
        new Row().add(
          new Cell(
            new Link(
              `!${scriptName}-Install-API --speakAs ${speakAs} ${playerId} ${serializedChoices}`,
              `Install and remove features`,
            ).render(),
            "text-align: center;",
          ).addAttribute(new Attribute("colspan", "2")),
        ),
      );

    pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${table.render()}`);
  };

  // Toggle a feature on or off.
  const toggleFeatureAPI = (msg) => {
    const commandName = `${scriptName}-Toggle-Feature-API`;
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != `!${commandName}`) {
      return;
    }

    if (!isParseleneCommonLoaded()) {
      return;
    }

    const speakAs = pc.extractCommandLineOption(args, "--speakAs", commandName);
    const playerId = args[1];
    const feature = args[2];
    const choices = deserializeChoices(args, 3);

    choices[feature] = !choices[feature];

    const serializedChoices = serializeChoices(choices);

    sendChat(
      speakAs,
      `!${scriptName}-Install-Menu-API --speakAs ${speakAs} ${playerId} ${serializedChoices}`,
    );
  };

  // Execute the installation and removal of features.
  const installAPI = (msg) => {
    const commandName = `${scriptName}-Install-API`;
    const args = msg.content.split(/\s+/);
    if (msg.type != "api" || args[0] != `!${commandName}`) {
      return;
    }

    if (!isParseleneCommonLoaded()) {
      return;
    }

    const speakAs = pc.extractCommandLineOption(args, "--speakAs", commandName);
    const playerId = args[1];
    const player = getObj("player", playerId);
    const playerName = player.get("displayname");

    const choices = deserializeChoices(args, 2);
    state[scriptName].installedFeatures = choices;

    let paraseleneDnD5eLibraryFunctions = [];
    let paraseleneDnD5eAbilities = [];
    let paraseleneToolsAbilities = [];
    let paraseleneMacros = [];

    paraseleneDnD5eAbilities = paraseleneDnD5eAbilities.concat(
      dnd5eScriptCardsAbilities,
    );
    paraseleneDnD5eAbilities = paraseleneDnD5eAbilities.concat(
      dnd5eTokenModAbilities,
    );

    paraseleneMacros = paraseleneMacros.concat(paraseleneCoreMacros);
    paraseleneMacros = paraseleneMacros.concat(tokenModMacros);

    if (state[scriptName].installedFeatures.DynamicLightingTool) {
      paraseleneMacros = paraseleneMacros.concat(dynamicLightingToolMacros);
    }
    if (state[scriptName].installedFeatures.MapChange) {
      paraseleneMacros = paraseleneMacros.concat(mapChangeMacros);
    }
    if (state[scriptName].installedFeatures.SmartAOE) {
      paraseleneDnD5eLibraryFunctions = paraseleneDnD5eLibraryFunctions.concat(
        smartAOELibraryFunctions,
      );
      paraseleneDnD5eAbilities = paraseleneDnD5eAbilities.concat(
        dnd5eSmartAOEAbilities,
      );
      paraseleneMacros = paraseleneMacros.concat(smartAOEMacros);
    }
    if (state[scriptName].installedFeatures.Teleport) {
      paraseleneMacros = paraseleneMacros.concat(teleportMacros);
    }
    if (state[scriptName].installedFeatures.TokenActions) {
      paraseleneMacros = paraseleneMacros.concat(tokenActionMacros);
    }
    if (state[scriptName].installedFeatures.TurnOrder) {
      paraseleneToolsAbilities = paraseleneToolsAbilities.concat(
        toolsTurnOrderAbilities,
      );
      paraseleneMacros = paraseleneMacros.concat(turnOrderMacros);
    }

    updateScriptCardsLibrary(
      speakAs,
      playerName,
      "ParaseleneDnD5e",
      paraseleneDnD5eLibraryFunctions,
    );
    updateAbilities(
      speakAs,
      playerName,
      "ParaseleneDnD5e",
      paraseleneDnD5eAbilities,
    );
    updateAbilities(
      speakAs,
      playerName,
      "ParaseleneTools",
      paraseleneToolsAbilities,
    );
    updateParaseleneMacros(speakAs, playerId, playerName, paraseleneMacros);
  };

  // Get the notes of a handout.
  const getHandoutNotes = function (handout) {
    return new Promise((resolve) => {
      handout.get("notes", (p) => {
        resolve(p);
      });
    });
  };

  // Update, remove, and install Paraselene ScriptCards libraries.
  const updateScriptCardsLibrary = async (
    speakAs,
    playerName,
    libraryName,
    newLibraryFunctionsList,
  ) => {
    const fullHandoutName = `ScriptCards Library ${libraryName}`;
    let summary = "";

    // Create the handout if it does not exist and is needed.
    let handout = null;
    const handouts = findObjs({
      type: "handout",
      name: fullHandoutName,
    });
    if (handouts.length > 0) {
      handout = handouts[0];
      summary = `${fullHandoutName}<br/>handout<br/>Already exists`;
    } else if (newLibraryFunctionsList.length > 0) {
      handout = createObj("handout", {
        name: fullHandoutName,
      });
      summary = `${fullHandoutName}<br/>handout<br/>${new Span("Created", "color: green").render()}`;
    } else {
      return;
    }

    const table = new Table();
    const cellStyle =
      "padding-left: 5px; padding-right: 5px; text-align: center;";
    table.add(new Row().add(new Cell(summary, cellStyle)));

    // Remove the handout if it is no longer needed.
    if (newLibraryFunctionsList.length == 0) {
      handout.remove();
      handout = null;
      summary = `${fullHandoutName}<br/>handout<br/>${new Span("Removed", "color: yellow").render()}`;
      table.add(new Row().add(new Cell(summary, cellStyle)));
    }

    const existingNotes = await getHandoutNotes(handout);
    const newNotes = (newLibraryFunctionsList.join("\n") + "\n").replaceAll(
      "\n",
      "<br>",
    );

    if (existingNotes == newNotes) {
      summary = `${fullHandoutName}<br/>handout<br/>Up to date`;
    } else {
      handout.set({
        notes: newNotes,
      });
      summary = `${fullHandoutName}<br/>handout<br/>${new Span("Updated", "color: green").render()}`;
    }
    table.add(new Row().add(new Cell(summary, cellStyle)));

    pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${table.render()}`);
  };

  // Update, remove, and install Paraselene character abilities.
  const updateAbilities = (
    speakAs,
    playerName,
    characterName,
    newActionsList,
  ) => {
    let summary = "";

    // Create the character if it does not exist and is needed.
    let character = null;
    const characters = findObjs({
      type: "character",
      name: characterName,
    });
    if (characters.length > 0) {
      character = characters[0];
      summary = `${characterName} character<br/>Already exists`;
    } else if (newActionsList.length > 0) {
      character = createObj("character", {
        name: characterName,
        controlledby: "all",
      });
      summary = `${characterName} character<br/>${new Span("Created", "color: green").render()}`;
    } else {
      return;
    }

    const table = new Table();
    const cellStyle =
      "padding-left: 5px; padding-right: 5px; text-align: center;";
    table.add(new Row().add(new Cell(summary, cellStyle)));

    // Create a list of the existing abilities.
    const existingAbilities = findObjs({
      type: "ability",
      characterid: character.id,
    });

    // Create an index of the new actions.
    const newActionsIndex = indexParaseleneActions(newActionsList);

    if (existingAbilities.length > 0) {
      table.add(
        new Row().add(
          new Header(
            `Updating and removing<br/>${characterName}<br/>abilities`,
            cellStyle,
          ),
        ),
      );
      existingAbilities.forEach((ability) => {
        const name = ability.get("name");
        const action = ability.get("action");
        const canonicalName = isParaseleneAction(action)
          ? getParaseleneActionCanonicalName(action)
          : "None";
        if (
          Object.prototype.hasOwnProperty.call(newActionsIndex, canonicalName)
        ) {
          const newAction = newActionsList[newActionsIndex[canonicalName]];
          if (action == newAction) {
            summary = `${name}<br/>Up to date`;
          } else {
            ability.set({
              action: newAction,
            });
            summary = `${name}<br/>${new Span("Updated", "color: green").render()}`;
          }
        } else {
          ability.remove();
          summary = `${name}<br/>${new Span("Removed", "color: yellow").render()}`;
        }
        table.add(new Row().add(new Cell(summary, cellStyle)));
      });
    }

    // Get a fresh list of the existing ability names, since some may have been removed.
    const existingAbilityNames = findObjs({
      type: "ability",
      characterid: character.id,
    }).map((ability) => {
      return ability.get("name");
    });
    const actionsToInstall = newActionsList.filter((action) => {
      return !existingAbilityNames.includes(getParaseleneAbilityName(action));
    });

    if (actionsToInstall.length > 0) {
      table.add(
        new Row().add(
          new Header(
            `Installing<br/>${characterName}<br/>abilities`,
            cellStyle,
          ),
        ),
      );
      actionsToInstall.forEach((action) => {
        const name = getParaseleneAbilityName(action);
        createObj("ability", {
          name: name,
          action: action,
          characterid: character.id,
        });
        table.add(
          new Row().add(
            new Cell(
              `${name}<br/>${new Span("Installed", "color: green").render()}`,
              cellStyle,
            ),
          ),
        );
      });
    }

    // Remove the character if it is no longer needed.
    if (newActionsList.length == 0) {
      character.remove();
      summary = `${characterName} character<br/>${new Span("Removed", "color: yellow").render()}`;
      table.add(new Row().add(new Cell(summary, cellStyle)));
    }

    pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${table.render()}`);
  };

  // Update, remove, and install Paraselene macros.
  const updateParaseleneMacros = (
    speakAs,
    playerId,
    playerName,
    paraseleneMacros,
  ) => {
    // Create a list of the existing Paraselene macros.
    const existingMacros = findObjs({
      type: "macro",
    }).filter((macro) => {
      return isParaseleneAction(macro.get("action"));
    });

    // Create an index of the new actions.
    const newActionIndex = indexParaseleneActions(paraseleneMacros);

    const cellStyle =
      "padding-left: 5px; padding-right: 5px; text-align: center;";
    const table = new Table();
    let summary = "";
    if (existingMacros.length > 0) {
      table.add(
        new Row().add(new Header(`Updating and removing macros`, cellStyle)),
      );
      existingMacros.forEach((macro) => {
        const name = macro.get("name");
        const action = macro.get("action");
        const canonicalName = getParaseleneActionCanonicalName(action);
        const displayName =
          name == canonicalName ? name : `${name}<br/>(${canonicalName})`;
        if (
          Object.prototype.hasOwnProperty.call(newActionIndex, canonicalName)
        ) {
          const newAction = paraseleneMacros[newActionIndex[canonicalName]];
          if (action == newAction) {
            summary = `${displayName}<br/>Up to date`;
          } else {
            macro.set({
              action: newAction,
            });
            summary = `${displayName}<br/>${new Span("Updated", "color: green").render()}`;
          }
        } else {
          macro.remove();
          summary = `${displayName}<br/>${new Span("Removed", "color: yellow").render()}`;
        }
        table.add(new Row().add(new Cell(summary, cellStyle)));
      });
    }

    // Get a fresh list of the existing Paraselene macro names, since some may have been removed.
    const existingMacroCanonicalNames = findObjs({
      type: "macro",
    })
      .filter((macro) => {
        return isParaseleneAction(macro.get("action"));
      })
      .map((macro) => {
        return getParaseleneActionCanonicalName(macro.get("action"));
      });
    const actionsToInstall = paraseleneMacros.filter((action) => {
      return !existingMacroCanonicalNames.includes(
        getParaseleneActionCanonicalName(action),
      );
    });

    if (actionsToInstall.length > 0) {
      table.add(new Row().add(new Header(`Installing macros`, cellStyle)));
      actionsToInstall.forEach((action) => {
        const name = getParaseleneActionCanonicalName(action);
        const settings = getParaseleneMacroSettings(action);
        const macroAttributes = {
          name: name,
          action: action,
          istokenaction: settings["Token Action"] == "Yes",
          playerid: playerId,
        };
        if (settings["Visibility"] == "All Players") {
          macroAttributes.visibleto = "all";
        }
        createObj("macro", macroAttributes);
        table.add(
          new Row().add(
            new Cell(
              `${name}<br/>${new Span("Installed", "color: green").render()}`,
              cellStyle,
            ),
          ),
        );
      });
    }

    pc.sendChatNoArchive(speakAs, `/w "${playerName}" <br/>${table.render()}`);
  };

  // Is an action a Paraselene action?
  const isParaseleneAction = (action) => {
    const lines = action.split("\n");
    return lines.length >= 2 && /^!# Paraselene-\S*$/.test(lines[0]);
  };

  // Return the canonical name of a Paraselene ability or macro action.
  const getParaseleneActionCanonicalName = (action) => {
    return action.split("\n")[0].substring("!# ".length);
  };

  // Return the abilty name of a Paraselene ability action.
  const getParaseleneAbilityName = (action) => {
    return getParaseleneActionCanonicalName(action).substring(
      "Paraselene-".length,
    );
  };

  // Return the index of a list of Paraselene actions.
  const indexParaseleneActions = (actionList) => {
    const actionIndex = {};
    actionList.forEach((action, index) => {
      actionIndex[getParaseleneActionCanonicalName(action)] = index;
    });
    return actionIndex;
  };

  // Return the Paraselene macro settings.
  const getParaseleneMacroSettings = (action) => {
    const settings = {};
    const lines = action.split("\n");
    if (!lines[1].startsWith("!# Settings:")) {
      return settings;
    }
    const settingsLine = lines[1].substring("!# Settings:".length);
    settingsLine.split(",").forEach((setting) => {
      const [key, value] = setting.split(":");
      settings[key.trim()] = value.trim();
    });
    return settings;
  };

  // Register event handlers.
  const registerEventHandlers = () => {
    on("chat:message", install);
    on("chat:message", installMenuAPI);
    on("chat:message", toggleFeatureAPI);
    on("chat:message", installAPI);
  };

  // When all scripts have loaded ...
  on("ready", () => {
    versionInfo();
    checkSchema();
    registerEventHandlers();
  });

  // Public interface.
  return {
    version: version,
  };
})(); // ParaseleneInstaller

// Register the length of this script.
{
  // Set this to the number of lines following the "throw new Error('')" below.
  const numberOfLinesFromErrorToScriptEnd = 9;
  try {
    throw new Error(""); // Set numberOfLinesFromErrorToScriptEnd to the number of lines following this line.
  } catch (exception) {
    const reportedLineNumber = parseInt(
      exception.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, "$1"),
      10,
    );
    const offset = API_Meta.ParaseleneInstaller.offset;
    const lineCount =
      reportedLineNumber - offset + numberOfLinesFromErrorToScriptEnd;
    API_Meta.ParaseleneInstaller.lineCount = lineCount;
  }
}
