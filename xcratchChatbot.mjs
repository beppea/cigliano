// xcratchChatbot.mjs

// xcratchChatbot.mjs

const img = "https://cdn.jsdelivr.net/gh/openai/openai-cookbook@main/ai-icon.png"; // Icon from OpenAI

// Traduzioni semplici
const translations = {
    it: {
        "chatbot.model": "imposta modello [MODEL]",
        "chatbot.key": "imposta chiave API [KEY]",
        "chatbot.ask": "chiedi a chatbot [PROMPT]",
        "chatbot.desc": "Chatbot AI (OpenAI, Llama, ecc.) personalizzabile",
        "chatbot.entry": "Chatbot AI",
    },
    en: {
        "chatbot.model": "set model [MODEL]",
        "chatbot.key": "set API key [KEY]",
        "chatbot.ask": "ask chatbot [PROMPT]",
        "chatbot.desc": "Customizable AI chatbot (OpenAI, Llama etc)",
        "chatbot.entry": "AI Chatbot",
    }
};

function t(msg) {
    let locale =
        (typeof Scratch !== "undefined" && Scratch.vm && Scratch.vm.runtime && Scratch.vm.runtime.locale) ||
        navigator.language?.substring(0, 2) ||
        "it";
    if (!["it", "en"].includes(locale)) locale = "en";
    return (
        translations[locale]?.[msg] ||
        translations["it"][msg] ||
        translations["en"][msg] ||
        msg
    );
}

// Variabili globali interne
let apiKey = "";
let model = "gpt-3.5-turbo";
let lastResponse = "";

// (Questo oggetto non viene esportato, può comunque essere usato da GUI personalizzate)
const entry = {
    name: t("chatbot.entry"),
    extensionId: "chatbot",
    extensionURL: "https://raw.githubusercontent.com/beppea/cigliano/main/xcratchChatbot.mjs",
    iconURL: img,
    insetIconURL: img,
    description: t("chatbot.desc"),
    featured: true,
    internetConnectionRequired: true,
    bluetoothRequired: false,
    helpLink: "https://platform.openai.com/docs/api-reference/chat",
    translationMap: translations,
};

// CLASSE PRINCIPALE DA ESPORTARE COME "default"
export default class ChatbotExtension {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "chatbot",
            name: t("chatbot.entry"),
            color1: "#9b59b6",
            color2: "#8e44ad",
            blocks: [
                {
                    opcode: "setModel",
                    blockType: "command",
                    text: t("chatbot.model"),
                    arguments: {
                        MODEL: { type: "string", defaultValue: "gpt-3.5-turbo" }
                    }
                },
                {
                    opcode: "setKey",
                    blockType: "command",
                    text: t("chatbot.key"),
                    arguments: {
                        KEY: { type: "string", defaultValue: "sk-..." }
                    }
                },
                {
                    opcode: "askChatbot",
                    blockType: "reporter",
                    text: t("chatbot.ask"),
                    arguments: {
                        PROMPT: { type: "string", defaultValue: "Ciao! Chi sei?" }
                    }
                }
            ],
            menus: {}
        };
    }

    setModel(args) {
        model = args.MODEL || "gpt-3.5-turbo";
    }

    setKey(args) {
        apiKey = args.KEY || "";
    }

    async askChatbot(args) {
        if (!apiKey) return "Imposta prima la chiave API";
        if (!model) return "Imposta un modello";
        try {
            const res = await fetch(this.endpoint(model), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey,
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: args.PROMPT }]
                }),
            });
            if (!res.ok) return "Errore HTTP " + res.status;
            const data = await res.json();
            let content =
                (data?.choices?.[0]?.message?.content ||
                    data?.choices?.[0]?.text ||
                    JSON.stringify(data)).trim();
            lastResponse = content;
            return content;
        } catch (e) {
            return "Errore rete/API: " + (e.message || e.name);
        }
    }

    endpoint(model) {
        return "https://api.openai.com/v1/chat/completions";
    }
}
