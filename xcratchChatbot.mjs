class HelloExtension {
  getInfo() {
    return {
      id: 'helloTest',
      name: 'CIAO',
      color1: "#f6c",
      blocks: [
        {
          opcode: 'sayHello',
          blockType: Scratch.BlockType.REPORTER,
          text: 'ciao a [NAME]',
          arguments: {
            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "amico" }
          }
        }
      ]
    };
  }

  sayHello(args) {
    return `Ciao, ${args.NAME}!`;
  }
}

Scratch.extensions.register(new HelloExtension());
