const commandHistory: string[] = [];
let commandHistoryOffset: number = 0;

function startupNidhogg() {
  loadSocketIO();
  loadCss();
  setTimeout(() => {
    addConsoleToDOM();
  }, 1000);
}

function loadCss() {
  ["/nidhogg/style.css"].forEach((file: string) => {
    var link = document.createElement("link");
    link.href = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName("head")[0].appendChild(link);
  });
}

function loadSocketIO() {
  var script = document.createElement("script"); // create a script DOM node
  script.src = "/socket.io/socket.io.js"; // set its src to the provided URL

  document.head.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function newLogMessage(
  command: string,
  clazz: string = "log"
): HTMLParagraphElement {
  const line: HTMLParagraphElement = document.createElement("p");
  line.classList.add("nidhoggReset", "nidhoggLogMessage", clazz);
  line.textContent = command;
  return line;
}

// todo classify!
function addConsoleToDOM() {
  // @ts-ignore
  const socket: any = io.connect("/");

  socket.on("nidhogg", (data: any) => {
    // assume only commands are send
    socket.emit("ratatosk", {
      source: "nidhogg",
      fuckapple: true,
      payload: {
        text: data.payload.text,
        type: "command",
      },
    });
    containerOutput.appendChild(newLogMessage("> " + data.payload.text));
    commandHistory.push(data.payload.text);
    const result = eval(data.payload.text);
    containerOutput.appendChild(newLogMessage("> " + result));
    socket.emit("ratatosk", {
      source: "nidhogg",
      fuckapple: true,
      payload: {
        text: result,
        type: "log",
      },
    });
  });

  const nidhoggConsole: HTMLDivElement = document.createElement("div");
  nidhoggConsole.classList.add(
    "nidhoggReset",
    "nidhoggConsole",
    "nidhoggHidden"
  );

  // show/hide button ======================================================================
  const showHideButton: HTMLButtonElement = document.createElement("button");
  showHideButton.textContent = ">_";
  showHideButton.classList.add("nidhoggReset", "nidhoggShowButton");
  showHideButton.addEventListener("click", () => {
    nidhoggConsole.classList.toggle("nidhoggHidden");
  });
  showHideButton.addEventListener("onlick", () => {
    alert("ulala");
  });
  document.body.appendChild(showHideButton);

  // output ================================================================================
  const containerOutput: HTMLDivElement = document.createElement("div");
  containerOutput.classList.add("nidhoggReset");
  nidhoggConsole.appendChild(containerOutput);

  // input =================================================================================
  const containerInput: HTMLDivElement = document.createElement("div");
  containerInput.classList.add("nidhoggReset");

  const inputCommands: HTMLTextAreaElement = document.createElement("textarea");
  inputCommands.classList.add("nidhoggCommandInput");
  inputCommands.addEventListener("keydown", function (event) {
    // Check if the pressed key is the up arrow key and if the textarea is focused
    if (
      event.ctrlKey &&
      event.key === "ArrowUp" &&
      document.activeElement === inputCommands
    ) {
      if (commandHistoryOffset < commandHistory.length) {
        commandHistoryOffset++;
      }

      inputCommands.value =
        commandHistory[commandHistory.length - commandHistoryOffset];
    } else if (
      event.ctrlKey &&
      event.key === "ArrowDown" &&
      document.activeElement === inputCommands
    ) {
      if (commandHistoryOffset > 1) {
        commandHistoryOffset--;
      }

      inputCommands.value =
        commandHistory[commandHistory.length - commandHistoryOffset];
    } else if (
      event.ctrlKey &&
      event.key === "Enter" &&
      document.activeElement === inputCommands
    ) {
      bttnExec.click();
    }
  });
  containerInput.appendChild(inputCommands);

  const bttnExec: HTMLButtonElement = document.createElement("button");
  bttnExec.classList.add("nidhoggReset", "nidhoggRunButton");
  bttnExec.onclick = () => {
    commandHistoryOffset = 0;
    const command: string = inputCommands.value;
    commandHistory.push(command);
    inputCommands.value = "";
    socket.emit("ratatosk", {
      source: "nidhogg",
      fuckapple: true,
      payload: {
        text: command,
        type: "command",
      },
    });
    containerOutput.appendChild(newLogMessage("> " + command));
    const result = eval(command);
    containerOutput.appendChild(newLogMessage("< " + result));
    socket.emit("ratatosk", {
      source: "nidhogg",
      fuckapple: true,
      payload: {
        text: result,
        type: "log",
      },
    });
    inputCommands.focus();
  };
  bttnExec.textContent = "/";
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
        socket.emit("ratatosk", {
          source: "nidhogg",
          fuckapple: true,
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
        socket.emit("ratatosk", {
          source: "nidhogg",
          fuckapple: true,
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
        socket.emit("ratatosk", {
          source: "nidhogg",
          fuckapple: true,
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
        socket.emit("ratatosk", {
          source: "nidhogg",
          fuckapple: true,
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

window.addEventListener("load", () => {
  startupNidhogg();
});
