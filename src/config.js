const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");

var config = {};

try {
    const configFile = yaml.load(fs.readFileSync(path.join(__dirname, "..", "config.yml")));

    config = {
        token: configFile.botToken ?? "",
        clientId: configFile.clientId ?? "",
        geniusKey: configFile.geniusApiKey ?? undefined,
        embedColour: configFile.embedColour ?? "#2F3136",
        analytics: configFile.enableAnalytics ?? true,
        stopEmoji: configFile.emojis.stop ?? "⏹",
        skipEmoji: configFile.emojis.skip ?? "⏭",
        queueEmoji: configFile.emojis.queue ?? "📜",
        pauseEmoji: configFile.emojis.pause ?? "⏯",
        lyricsEmoji: configFile.emojis.lyrics ?? "📜",
        backEmoji: configFile.emojis.back ?? "⏮",
        leaveOnEndDelay: configFile.player.leaveOnEndDelay ?? 300000,
        leaveOnStopDelay: configFile.player.leaveOnStopDelay ?? 300000,
        leaveOnEmptyDelay: configFile.player.leaveOnEmptyDelay ?? 300000,
        deafenBot: configFile.player.deafenBot ?? false,
        logToWebhook: configFile.logEventsToWebhook.enabled ?? false,
        logToWebhookUrl: configFile.logEventsToWebhook.webhookUrl ?? "",
    };
} catch (e) {
    logger.error("Unable to parse config.yml. Please make sure it is valid YAML.");
    process.exit(1);
}

if (!config.token || config.token === "") {
    logger.error("Please supply a bot token in your configuration file.");
    process.exit(1);
}

if (!config.clientId || config.clientId === "") {
    logger.error("Please supply a client ID in your configuration file.");
    process.exit(1);
}

if (config.geniusKey === "") config.geniusKey = undefined;

if (typeof config.geniusKey === "undefined") {
    logger.warn("No Genius API key was provided. The lyrics functions will not be as reliable.");
}

if (config.logToWebhook && (!config.logToWebhookUrl || config.logToWebhookUrl === "")) {
    logger.warn("You have enabled logging to a webhook, but have not provided a webhook URL. Logging to a webhook will be disabled.");
    config.logToWebhook = false;
}

module.exports = config;
