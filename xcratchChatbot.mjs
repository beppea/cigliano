// xcratchChatbot.mjs

const img = "https://cdn.jsdelivr.net/gh/openai/openai-cookbook@main/ai-icon.png"; 
// Icon from OpenAI's openai-cookbook/icons/ai-icon.png (libera, 40x40)

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
    (typeof Scratch !== "undefined" &&
      Scratch.vm &&
      Scratch.vm.runtime &&
      Scratch.vm.runtime.locale) ||
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

// Definizione Xcratch (entry point menu)
export const entry = {
  name: t("chatbot.entry"),
  extensionId: "chatbot",
  extensionURL: "https://raw.githubusercontent.com/beppea/cigliano/refs/heads/main/xcratchChatbot.mjs",
  iconURL: img,
  insetIconURL: img,
  description: t("chatbot.desc"),
  featured: true,
  internetConnectionRequired: true,
  bluetoothRequired: false,
  helpLink: "https://platform.openai.com/docs/api-reference/chat",
  translationMap: translations,
};

// La classe dei blocchi
export class blockClass {
  constructor(runtime) {
    this.runtime = runtime;
  }
  getInfo() {
    return {
      id: "chatbot",
      name: t("chatbot.entry"),
      color1: "#9b59b6",
      color2: "#8e44ad",
      // Blocchi
      blocks: [
        {
          opcode: "setModel",
          text: t("chatbot.model"),
          blockType: "command",
          arguments: {
            MODEL: { type: "string", defaultValue: "gpt-3.5-turbo" }
          }
        },
        {
          opcode: "setKey",
          text: t("chatbot.key"),
          blockType: "command",
          arguments: {
            KEY: { type: "string", defaultValue: "sk-..." }
          }
        },
        {
          opcode: "askChatbot",
          text: t("chatbot.ask"),
          blockType: "reporter",
          arguments: {
            PROMPT: { type: "string", defaultValue: "Ciao! Chi sei?" }
          }
        }
      ],
      // Menu (vuoto, ma volendo puoi aggiungere modelli)
      menus: {}
    };
  }
  setModel(args) {
    model = args.MODEL || "gpt-4.1-mini";
  }
  setKey(args) {
    apiKey = args.KEY || "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";
  }
  async askChatbot(args) {
    if (!apiKey) return "Imposta prima la chiave API";
    if (!model) return "Imposta un modello";
    try {
      const res = await fetch(this.endpoint(model), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: args.PROMPT }]
        }),
      });
      if (!res.ok) return "Errore HTTP " + res.status;
      const data = await res.json();
      let content = (data?.choices?.[0]?.message?.content ||
                     data?.choices?.[0]?.text ||
                     JSON.stringify(data)).trim();
      lastResponse = content;
      return content;
    } catch (e) {
      return "Errore rete/API: " + (e.message || e.name);
    }
  }

  // Adatta questo per modelli diversi da OpenAI
  endpoint(model) {
    // Qui puoi aggiungere routing per altri provider
    return "https://api.openai.com/v1/chat/completions";
  }
}
