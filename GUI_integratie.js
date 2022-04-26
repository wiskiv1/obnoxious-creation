var input = {
    agents: 0,
    gestart: false
}

//verbind alle variabelen aan de DOM inputs en pas alle maatregelen toe
function toepassen() {
    input.agents = int(document.getElementById("density").value);
    //simulatie
    store.x = int(document.getElementById("WPosX").value);
    store.y = int(document.getElementById("WPosY").value);
    store.min = int(document.getElementById("Wmin").value);
    store.min = int(document.getElementById("Wmax").value);
    bubbels.size = int(document.getElementById("Bsize").value);
    bubbels.lengte = int(document.getElementById("Blengte").value);
    bubbels.min = int(document.getElementById("Bmin").value);
    bubbels.max = int(document.getElementById("Bmax").value);
    //ziekte
    disease.hoesttijd = int(document.getElementById("hoesttijd").value);
    disease.compartimentPeriodes[1] = int(document.getElementById("incubatie").value);
    disease.compartimentPeriodes[2] = int(document.getElementById("ziek").value);
    disease.compartimentPeriodes[3] = int(document.getElementById("hersteld").value);
    infectieFunctieString = str(document.getElementById("infectieFunctie").value);
    maakWaarschijnlijkheidsFunctie(infectieFunctieString);
    disease.vaccin = 1 - float(document.getElementById("vaccinMulti").value);
    disease.masker = 1 - float(document.getElementById("maskerMulti").value);
    disease.incubatie = float(document.getElementById("incubatieMulti").value);
    //maatregelen
    maatregels.bubbels = document.getElementById("bubbels").checked;
    maatregels.socialDistance = document.getElementById("socialDistance").checked;
    afstandStraal = int(document.getElementById("straal").value);
    maatregels.winkel = document.getElementById("winkel").checked;
    maatregels.masker = document.getElementById("masker").checked;
    maatregels.vaccinPercent = float(document.getElementById("vaccinpercentage").value);
    maatregels.antiMaatregel = float(document.getElementById("antivax").value);

    maakAntiCovid();
    draagMasker();
    vaccineren();

    console.log('maatregels toepgepast!');
}


function start() { //start de simulatie (infecteer 1 iemand)
    if (input.gestart == true) {return;}
    agents = [];

    for (var i = 0; i < input.agents; i++) {
        agents.push(new agent(random(width), random(height), i)); //maak n agents verspreid random over het veld
    }

    toepassen()
    
    //infecteer 1 iemand
    agents[0].compartimentTimer = floor(disease.compartimentPeriodes[1] * (0.5 + Math.random()));
    agents[0].compartiment = 1;
    current[0]--;
    current[1]++;
    input.gestart = true;
    console.rainbow("simulatie gestart");

    //verstop start knop
    document.getElementById("start").style.display = "none";
    document.getElementById("density").style.display = "none";
    document.getElementById("densityLabel").style.display = "none";
    document.getElementById("opslaan").style.display = "inline";
}