function startup() {
  overrideConsole();
  // @ts-ignore
  const socket: any = io.connect("/");

  socket.on("eagle", (data: any) => {
    switch (data.payload.type) {
      case "command":
      case "log":
        console.log(data.payload.text);
        break;
      case "info":
        console.info(data.payload.text);
        break;
      case "warn":
        console.warn(data.payload.text);
        break;
      case "error":
        console.error(data.payload.text);
        break;
      default:
        console.error("UNKNOWN LOG TYPE " + data.payload.type);
        break;
    }
  });

  const bttnRun = document.getElementById("bttnRun");

  bttnRun!.onclick = () => {
    const command = (
      document.getElementById("inputCommands") as HTMLInputElement
    ).value;
    (document.getElementById("inputCommands") as HTMLInputElement).value = "";

    socket.emit("ratatosk", {
      source: "eagle",
      fuckapple: true,
      payload: {
        text: command,
        type: "command",
      },
    });
  };
}

function newLogMessage(command: string, clazz: string = "log") {
  const line: HTMLParagraphElement = document.createElement("p");
  line.classList.add(clazz);
  line.textContent = command;
  return line;
}

function overrideConsole() {
  const containerOutput: HTMLDivElement = document.getElementById(
    "containerOutput"
  ) as HTMLDivElement;
  // define a new console
  var console = (function (oldCons) {
    return {
      log: function (text: string) {
        oldCons.log(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text));
      },
      info: function (text: string) {
        oldCons.info(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text, "info"));
      },
      warn: function (text: string) {
        oldCons.warn(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text, "warn"));
      },
      error: function (text: string) {
        oldCons.error(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text, "error"));
      },
    };
  })(window.console);

  //Then redefine the old console
  //@ts-ignore we are cowboys! YEHAAA
  window.console = console;
}
