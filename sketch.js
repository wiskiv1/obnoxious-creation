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
  max : 1200,
  min : 1050,
  size : 4,
  lengte : 250
}
let disease = {
  compartimentPeriodes: [0, 20, 40, 0], //gemiddelde periode dat een agent zich in elke fase bevindt (in secondes niet frames), is nul als het niet van tijd afhangt [vatbaar, incubatie, ziek, hersteld/dood]
  hoesttijd : 30, //periode tussen hoestjes in frames (30fps)
  infectieFunctie : null, //wordt gevuld in setup() is de waarschijnlijkheid op infectie op basis van afstand
  infectieRadius : 30,
  masker : 0.7, //infectiemultiplier
  vaccin : 0.1,  //infectiemultiplier
  assymptomatisch : 1, //infectiemultiplier
  incubatie : 1, //infectiemultiplier
}
let maatregels = { //simulatie parameters zijn universeel
  bubbels : true,
  socialDistance : true,
  winkel : false,
  maskerPercent : 1,
  vaccinPercent : 1
}
let infectieFunctieString = "pow(1.36 , -4*x)";


let agents = [];
let eenzameAgents = []; // agents die willen socializen en een bubbel willen vormen

function setup() {
  createCanvas(800, 600);
  console.rainbow("Welkom bij mijn simulatie");

  frameRate(30);//framerate op 30 zetten, wordt makkelijk om later te berekenen hoe lang agents bij elkaar in de buurt zijn in "echte tijd"

  for (var i = 0; i < 200; i++) {
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

  if (frameCount % disease.hoesttijd == 0) {
    for (let x of agents) {
      x.versprijd();
    }
  }

  // teken winkel
  if (maatregels.winkel == true) {
    push();
    fill(255, 76, 0);
    strokeWeight(3)
    stroke(25)
    square(store.x, store.y, 20);
    pop();
  }

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


}

//maak functie die de waarschijnlijkheid geeft op infectie geeft gebaseerd op afstand en steek deze in disease.infectieFunctie
//var functie = new Function('d', 'return(d);');
//WTF dees is verdacht easy lol
function maakWaarschijnlijkheidsFunctie(f) {
  let func = f;
  func = func.replace("x", "(d / 10)"); //zorg dat in de functie 1m gelijk is aan 10 pixels

  disease.infectieFunctie = new Function("d, zieke, gezond", `
    let waarschijnlijkheid = ` + func + `; 
    if (zieke.masker == true) {waarschijnlijkheid = waarschijnlijkheid * disease.masker;}
    if (zieke.asymptomatsch == true) {waarschijnlijkheid = waarschijnlijkheid * disease.assymptomatisch;}
    if (zieke.compartiment == 1) {waarschijnlijkheid = waarschijnlijkheid * disease.incubatie;}
    if (gezond.masker == true) {waarschijnlijkheid = waarschijnlijkheid * disease.masker;} 
    if (gezond.gevacinneerd == true) {waarschijnlijkheid = waarschijnlijkheid * disease.vaccin;}
    return waarschijnlijkheid;`);
}

function start() { //start de simulatie (infecteer 1 iemand)
  agents[0].compartimentTimer = floor(disease.compartimentPeriodes[1] * (0.5 + Math.random()));
  agents[0].compartiment = 1;
  console.log("simulatie gestart");
}

//function mousePressed() {agents.push(new agent(mouseX, mouseY, agents.length));}
//function mousePressed() {print(agents[0].winkelTimer)}

/*TODO
GUI
Bubbels !done!
Versprijding
grafieken?
*/

`werkt deze 
shit echt wow dit is nice lol
`