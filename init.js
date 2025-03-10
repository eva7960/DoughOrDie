(function () {
  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });
  window.overworld = overworld; 
  overworld.init();
  window.timer = new Timer({ 
    container: document.querySelector(".game-container"),
    initialTime: 120 //set inital time here 
  });
  window.timer.start();

  const backgroundMusic = new Audio('background.mp3'); 
  backgroundMusic.loop = true;   
  backgroundMusic.volume = 0.1;   

  document.addEventListener('click', function startMusic() { //user has to click before it starts playing 
    backgroundMusic.play().catch(err => {
      console.error("music error", err);
    });
    document.removeEventListener('click', startMusic);
  });
})();