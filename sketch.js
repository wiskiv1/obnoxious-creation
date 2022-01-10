//simulation variables: variabelen die de gebruiker kan aanpassen om de simulatie te bepalen
//standaardwaarden staan hier maar kunnen via GIU worden aangepast
var afstandStraal = 30;
let store = {
  x : 390,
  y : 290,
  max : 1200,
  min : 1050
}
let bubbels = {
  max : 0,
  min : 0,
  size : 4
}

let agents = []

function setup() {
  createCanvas(800, 600);
  console.rainbow("Welkom bij mijn simulatie");

  frameRate(30);//framerate op 30 zetten, wordt makkelijk om later te berekenen hoe lang agents bij elkaar in de buurt zijn in "echte tijd"
  //als we er bv van uitgaan dat 1 frame bv 1 sec is
  //om zelfde reden gaan we er van uit gaan dat 1 pixel bv 10 cm is

  for (var i = 0; i < 250; i++) {
    agents.push(new agent(random(width), random(height))); //maak 100 agents verspreid random over het veld
  }
}

function draw() {
  background(51);
  for (let x of agents) {
    x.show();
    //x.afstand();
    //x.gaNaar(400, 300);
    x.update();
  }

  // teken winkel
  push();
  fill(255, 76, 0);
  strokeWeight(3)
  stroke(25)
  square(store.x, store.y, 20);
  pop();


}

//function mousePressed() {agents.push(new agent(mouseX, mouseY));}
function mousePressed() {print(agents[0].winkelTimer)}

/*TODO
GIU
Bubbels
Versprijding
grafieken?
*/