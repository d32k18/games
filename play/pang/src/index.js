//TO DO
// 1. Add delay for game start
// 2. Bubble collision sometimes not correct in corners
// 3. Add popping sprite sprite
// 4. Add player death sprite

//REMINDER
// 1. Add back in dying and resetting level on death


import Pang from './pang';
import GameView from './game_view';

document.addEventListener("DOMContentLoaded", () => {
  
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext("2d");
  canvas.width = Pang.DIM_X;
  canvas.height = Pang.DIM_Y;
  
  const pang = new Pang();
  new GameView(pang, ctx, canvas).start();
  
  console.log("webpack is workingggg")
})