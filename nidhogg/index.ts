function startup() {
  loadCss();
  addConsoleToDOM();
}

function loadCss() {
  var link = document.createElement("link");
  link.href = "style.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";

  document.getElementsByTagName("head")[0].appendChild(link);
}

function newLogMessage(
  command: string,
  clazz: string = "log"
): HTMLParagraphElement {
  const line: HTMLParagraphElement = document.createElement("p");
  line.classList.add(clazz);
  line.textContent = command;
  return line;
}

// todo classify!
function addConsoleToDOM() {
  // @ts-ignore
  const socket: any = io.connect("/");

  const nidhoggConsole: HTMLDivElement = document.createElement("div");

  // output ================================================================================
  const containerOutput: HTMLDivElement = document.createElement("div");
  nidhoggConsole.appendChild(containerOutput);

  // input =================================================================================
  const containerInput: HTMLDivElement = document.createElement("div");

  const inputCommands: HTMLInputElement = document.createElement("input");
  containerInput.appendChild(inputCommands);

  const bttnExec: HTMLButtonElement = document.createElement("button");
  bttnExec.onclick = () => {
    const command: string = inputCommands.value;
    inputCommands.value = "";
    socket.emit("upstream", {
      source: "nidhogg",
      payload: {
        text: command,
        type: "command",
      },
    });
    containerOutput.appendChild(newLogMessage("> " + command));
    const result = eval(command);
    containerOutput.appendChild(newLogMessage("> " + result));
    socket.emit("upstream", {
      source: "nidhogg",
      payload: {
        text: result,
        type: "log",
      },
    });
  };
  bttnExec.textContent = "run";
  containerInput.appendChild(bttnExec);

  nidhoggConsole.appendChild(containerInput);

  document.body.appendChild(nidhoggConsole);

  // define a new console
  var console = (function (oldCons) {
    return {
      log: function (text: string) {
        oldCons.log(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text));
        socket.emit("upstream", {
          source: "nidhogg",
          payload: {
            text: text,
            type: "log",
          },
        });
      },
      info: function (text: string) {
        oldCons.info(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text, "info"));
        socket.emit("upstream", {
          source: "nidhogg",
          payload: {
            text: text,
            type: "info",
          },
        });
      },
      warn: function (text: string) {
        oldCons.warn(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text, "warn"));
        socket.emit("upstream", {
          source: "nidhogg",
          payload: {
            text: text,
            type: "warn",
          },
        });
      },
      error: function (text: string) {
        oldCons.error(text);
        // Your code
        containerOutput.appendChild(newLogMessage("< " + text, "error"));
        socket.emit("upstream", {
          source: "nidhogg",
          payload: {
            text: text,
            type: "error",
          },
        });
      },
    };
  })(window.console);

  //Then redefine the old console
  //@ts-ignore we are cowboys! YEHAAA
  window.console = console;
}

window.onload = () => startup();
