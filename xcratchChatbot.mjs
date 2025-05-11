class AIExtension {
  constructor() {
    this.apiKey = '';
    this.model = '';
  }
  setAPIKey(args) {
    this.apiKey = args.KEY;
  }
  setModel(args) {
    this.model = args.MODEL;
  }
  async askAI(args) {
    if (!this.apiKey || !this.model) return 'Imposta chiave e modello!';
    const url = 'https://api.openai.com/v1/chat/completions';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{role: "user", content: args.TEXT}]
        })
      });
      const data = await response.json();
      if (data && data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim();
      }
      return JSON.stringify(data);
    } catch (err) {
      return err.message;
    }
  }
  getInfo() {
    return {
      id: 'aiapi',
      name: 'AI API',
      color1: "#a9d",
      blocks: [
        {
          opcode: 'setAPIKey',
          blockType: Scratch.BlockType.COMMAND,
          text: 'imposta chiave OpenAI [KEY]',
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'sk-...',
            }
          }
        },
        {
          opcode: 'setModel',
          blockType: Scratch.BlockType.COMMAND,
          text: 'imposta modello [MODEL]',
          arguments: {
            MODEL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'gpt-3.5-turbo',
            }
          }
        },
        {
          opcode: 'askAI',
          blockType: Scratch.BlockType.REPORTER,
          text: 'chiedi IA [TEXT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Ciao!',
            }
          }
        }
      ]
    };
  }
}

// Import Xcratch environment
Scratch.extensions.register(new AIExtension());
