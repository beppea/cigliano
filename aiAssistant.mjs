export default class AIAssistantExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.response = "Attendi una risposta...";
  }

  getInfo() {
    return {
      id: 'aiAssistant',
      name: 'Assistente AI',
      blocks: [
        {
          opcode: 'askAI',
          blockType: Scratch.BlockType.COMMAND,
          text: 'fai domanda [QUESTION] all\'AI',
          arguments: {
            QUESTION: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Che cos\'è la fotosintesi clorofilliana?'
            }
          }
        },
        {
          opcode: 'getResponse',
          blockType: Scratch.BlockType.REPORTER,
          text: 'risposta AI'
        }
      ],
      color1: '#4C97FF',
      color2: '#3373CC',
      color3: '#2E69C7',
      menuIconURI: null,
      blockIconURI: null
    };
  }

  askAI(args) {
    const question = args.QUESTION;
    this.response = "Attendi una risposta...";

    fetch('http://localhost:5000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question })
    })
    .then(res => res.json())
    .then(data => {
      this.response = data.answer || "Nessuna risposta.";
    })
    .catch(err => {
      console.error("Errore AI:", err);
      this.response = "Errore durante la richiesta.";
    });
  }

  getResponse() {
    return this.response;
  }
}
