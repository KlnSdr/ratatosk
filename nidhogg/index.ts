function startup() {
  addConsoleToDOM();
}

function addConsoleToDOM() {
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
    eval(command);
  };
  bttnExec.textContent = "run";
  containerInput.appendChild(bttnExec);

  nidhoggConsole.appendChild(containerInput);

  document.body.appendChild(nidhoggConsole);
}

window.onload = () => startup();
