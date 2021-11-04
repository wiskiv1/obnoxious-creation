let agents = []

function setup() {
  createCanvas(800, 600);
  console.rainbow("Hello World!");

  frameRate(30);
  //framerate op 30 zetten, wordt makkelijk om later te berekenen hoe lang agents bij elkaar in de buurt zijn in "echte tijd"
  //als we er van uitgaan dat 1 frame bv 1 sec is
  //om zelfde reden gaan we er van uit gaan dat 1 pixel 10 cm is

  agents.push(new agent(400, 300));
}

function draw() {
  background(51);
  agents[0].show();
  agents[0].update();
}
