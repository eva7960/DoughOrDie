(function () {
  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });
  window.overworld = overworld; 
  overworld.init();
  window.timer = new Timer({ 
    container: document.querySelector(".game-container"),
    initialTime: 2 //set inital time here 
  });
  window.timer.start();
})();