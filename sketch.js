//simulation variables: variabelen die de gebruiker kan aanpassen om de simulatie te bepalen
//standaardwaarden staan hier maar kunnen via GUI worden aangepast
var afstandStraal = 30;
let store = {
  x : 390,
  y : 290,
  max : 1200,
  min : 1050
}
let bubbels = {
  max : 300,
  min : 200,
  size : 4,
  lengte : 250
}

let agents = [];
let eenzameAgents = []; // agents die willen socializen en een bubbel willen vormen

function setup() {
  createCanvas(800, 600);
  console.rainbow("Welkom bij mijn simulatie");

  frameRate(30);//framerate op 30 zetten, wordt makkelijk om later te berekenen hoe lang agents bij elkaar in de buurt zijn in "echte tijd"

  for (var i = 0; i < 10; i++) {
    agents.push(new agent(random(width), random(height), i)); //maak 100 agents verspreid random over het veld
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
  //square(store.x, store.y, 20);
  pop();

  //zet 4 eenzame agents in een bubbel en geef ze een leider
  if (eenzameAgents.length >= bubbels.size) { 
    //slaag leider ID op en verwijder uit de lijst
    let leaderID = eenzameAgents[0]; //leider
    agents[leaderID].bubbelId = -1;
    agents[leaderID].bubbelTimer = -2;
    eenzameAgents.shift();

    //zet voor de rest van de agents bubbelId op LeaderId
    //en bubbelTimer op -2
    for (let i = 0; i < bubbels.size - 1; i++) {
      agents[eenzameAgents[0]].bubbelId = leaderID;
      agents[eenzameAgents[0]].bubbelTimer = -2;
      eenzameAgents.shift();
    }
  }

  //
}

function mousePressed() {agents.push(new agent(mouseX, mouseY, agents.length));}
//function mousePressed() {print(agents[0].winkelTimer)}

/*TODO
GUI
Bubbels !done!
Versprijding
grafieken?
*/