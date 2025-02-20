(function () {
  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });
  window.overworld = overworld;
  overworld.init();

  window.timer = new Timer({ initialTime: 2 });
  window.timer.start();
})();

