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
  masker : 0.7, //infectiemultiplier
  vaccin : 0.1,  //infectiemultiplier
  assymptomatisch : 1, //infectiemultiplier (momenteel is nog niemand assymptomatisch maar komt wel)
  incubatie : 1, //infectiemultiplier
}
let maatregels = { //simulatie parameters zijn universeel
  bubbels : true,
  socialDistance : true,
  winkel : false,
  masker : false, //% agents met masker (uitgezonderd anti maatregels)
  vaccinPercent : 0, //% mensen gevaccineerd (uitgezonderd anti maatregels)
  antiMaatregel : 0, //% anti maatregels (geen masker, vaccin of social distancing)
}
let infectieFunctieString = "pow(1.36 , -4*x)";

//statistieken variabelen
let current = [0, 0, 0, 0, 0, 0, 0] //#vatbaar, #incubatie, #ziek, #hersteld, #antiCovid, #masker, #vaccin
let history = []

let agents = [];
let eenzameAgents = []; // agents die willen socializen en een bubbel willen vormen

function setup() {
  createCanvas(800, 600);
  console.rainbow("Welkom bij mijn simulatie");

  frameRate(30);//framerate op 30 zetten, wordt makkelijk om later te berekenen hoe lang agents bij elkaar in de buurt zijn in "echte tijd"

  for (var i = 0; i < 0; i++) {
    agents.push(new agent(random(width), random(height), i)); //maak 100 agents verspreid random over het veld
  }

  maakWaarschijnlijkheidsFunctie(infectieFunctieString);

  current[0] = agents.length;

  //maatregel variabelen toepassen
  maakAntiCovid();
  draagMasker();
  vaccineren();
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
    //voeg current toe aan history
    opslaan();
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

//bepaal de agents die een masker moeten dragen
function draagMasker() {
  current[5] = 0; //reset statistiek
  if (maatregels.masker == true) {
    for (let x of agents) {
      if (x.antiCovid == false) {x.masker = true; current[5]++;}//geef iedereen masker die geen anti covid is
    }
  } else {
    for (let x of agents) {
      x.masker = false;//iedereen doet masker uit
    }
  }
}

//bepaal wie anti covid is
function maakAntiCovid() {
  for (let x of agents) {
    x.antiCovid = false; //reset iedereen
  }
  let temp = Math.floor(agents.length * maatregels.antiMaatregel); //hoeveel man is anti maatregels
  for (let i = 0; i < temp; i++) {//kies temp aantal agents voor anti covid
    let a = random(agents);
    a.antiCovid = true;
  }
  current[4] = temp; //update statistieken
}

function vaccineren() {
  for (let x of agents) {
    x.gevacinneerd = false; //reset iedereen
  }
  current[6] = 0;//reset statistiek

  let temp = Math.floor(agents.length * (1 - maatregels.antiMaatregel)); //hoeveel man is niet anti maatregels
  temp = Math.floor(temp * maatregels.vaccinPercent); //hoeveem man is gevacineerd
 
  let x = 0;
  for (let i = 0; i < temp; i ++) {
    while (true) { //zoek de eerste agent in de lijst die geen anticovid en ongevacineerd is
      if (agents[i + x].antiCovid == false && agents[i + x].gevacinneerd == false) {
        agents[i + x].gevacinneerd = true; //vaccineer agent
        current[6]++; //voeg 1 toe aan statistieken
        break; //reset loop (zoek naar volgende ongevaccineerde)
      } else {x++;}
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
  current[0]--;
  current[1]++;
  console.log("simulatie gestart");
}

function opslaan() {//slaag current statistieken op naar history
  let temp = []; //gwn copiedje maken zodat we geen reference hoeven te maken
  for (let x of current) {
    temp.push(x);
  }
  history.push(temp);
}

//function mousePressed() {agents.push(new agent(mouseX, mouseY, agents.length));}
//function mousePressed() {print(agents[0].winkelTimer)}

/*TODO
GUI
Bubbels !done!
Versprijding !done!
grafieken? (mementeel gwn tabel)
*/

`werkt deze 
shit echt wow dit is nice lol
`