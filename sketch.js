//simulation variables: variabelen die de gebruiker kan aanpassen om de simulatie te bepalen
//standaardwaarden staan hier maar kunnen via GUI worden aangepast
//nog toe te voegen: max snelheid, max acceleratie, masker, ziekte eigenschappen, recovery tijd,
var afstandStraal = 30; //10 pixels = 1m
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
let disease = {
  incubation : 300,
  herstelperiode : 600,
  hoesttijd : 30, //periode tussen hoestjes
  infectieFunctie : null, //wordt gevuld in setup() is de waarschijnlijkheid op infectie op basis van afstand
  infectieRadius : 30,
}
let infectieFunctieString = "1 / pow(x, 2)";


let agents = [];
let eenzameAgents = []; // agents die willen socializen en een bubbel willen vormen

function setup() {
  createCanvas(800, 600);
  console.rainbow("Welkom bij mijn simulatie");

  frameRate(30);//framerate op 30 zetten, wordt makkelijk om later te berekenen hoe lang agents bij elkaar in de buurt zijn in "echte tijd"

  for (var i = 0; i < 4; i++) {
    agents.push(new agent(random(width), random(height), i)); //maak 100 agents verspreid random over het veld
  }

  maakWaarschijnlijkheidsFunctie(infectieFunctieString);
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
  console.log(dist(agents[1].position.x, agents[1].position.y, agents[0].position.x, agents[0].position.y));
}

//maak functie die de waarschijnlijkheid geeft op infectie geeft gebaseerd op afstand en steek deze in disease.infectieFunctie
//var functie = new Function('d', 'return(d);');
//WTF dees is verdacht easy lol
function maakWaarschijnlijkheidsFunctie(f) {
  let func = f;
  func = func.replace("x", "(d / 10)"); //zorg dat in de functie 1m gelijk is aan 10 pixels

  disease.infectieFunctie = new Function("d", "let waarschijnlijkheid = " + func + "; return waarschijnlijkheid;")
}

function mousePressed() {agents.push(new agent(mouseX, mouseY, agents.length));}
//function mousePressed() {print(agents[0].winkelTimer)}

/*TODO
GUI
Bubbels !done!
Versprijding
grafieken?
*/