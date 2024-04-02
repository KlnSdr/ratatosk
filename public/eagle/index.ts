function startupEagle() {
  //@ts-ignore
  context = "eagle";

  let interval: any;

  interval = setInterval(() => {
    if (document.getElementById("nidhoggShowButton") !== null) {
      clearInterval(interval);
      document.getElementById("nidhoggShowButton")?.click();
      document.getElementById("eagleLoading")?.remove();
    }
  }, 10);
}
