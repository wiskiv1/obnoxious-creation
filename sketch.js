let agents = []

function setup() {
  createCanvas(800, 600);
  console.rainbow("Welkom bij mijn simulatie");

  frameRate(30);
  //framerate op 30 zetten, wordt makkelijk om later te berekenen hoe lang agents bij elkaar in de buurt zijn in "echte tijd"
  //als we er bv van uitgaan dat 1 frame bv 1 sec is
  //om zelfde reden gaan we er van uit gaan dat 1 pixel bv 10 cm is

  for (var i = 0; i < 200; i++) {
    agents.push(new agent(random(width), random(height))); //maak 100 agents verspreid random over het veld
  }
}

function draw() {
  background(51);
  for (let x of agents) {
    x.show();
    x.afstand();
    x.update();
  }
}

//function mousePressed() {agents.push(new agent(mouseX, mouseY));}