class agent {

    constructor(x, y, id) {
        //bewegings variabelen
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.radius = afstandStraal;
        this.socialMulti = 1;
        this.winkelTimer = floor(random(0, store.max));
        this.winkelMulti = 0.75;
        this.bubbelTimer = floor(random(0, bubbels.max));
        this.bubbelMulti = 1;
        this.bubbelId = -1; //agentId van de 'leider' van de bubbel, -1 betekend zelf de leider van de bubbbel
        this.agentId = id;

        //versprijdingsvariabelen
        this.compartiment = 0; //infectiestatus 0 = vatbaar, 1 = incubatie, 2 = ziek, 3 = hersteld/dood
        this.compartimentTimer = 0;
        this.gevacinneerd = false;
        this.masker = false;
        this.asymptomatsch = false;
        this.antiCovid = false;
    }

    show() {
        push();
        if (this.compartiment == 0) {stroke(255);}
        if (this.compartiment == 1) {stroke(205, 105, 87);}
        if (this.compartiment == 2) {stroke(200, 0, 0);}
        if (this.compartiment == 3) {stroke(100);}
        strokeWeight(8);
        point(this.position.x, this.position.y);
        strokeWeight(3)
        stroke(0);
        fill(255);
        textSize(8);
        if (debug) {text(this.agentId, this.position.x, this.position.y)}
        pop();
    }

    versprijd() {
        //bepaal of agents geinfecteerd worden wanneer ze in de buurt zijn van iemand positief
        if (this.compartiment == 1 || this.compartiment == 2) {
            for (let a of agents) {
                if (a.compartiment != 0) {continue;} //skip loop als agent onvatbaar is
                let d = dist(a.position.x, a.position.y, this.position.x, this.position.y);
                
                //neem willekeurig getal [0,1] als dit kleiner is als de infectiewaarschijnlijkheid dan is agent geinfecteerd
                if (disease.infectieFunctie(d, this, a) >= Math.random()) {
                    a.compartimentTimer = floor(disease.compartimentPeriodes[1] * (0.5 + Math.random()));
                    a.compartiment = 1;
                    current[0]--;//update statistieken
                    current[1]++;
                }
            }
        }

        if (this.compartiment != 0) {
            if (this.compartimentTimer == 0 && disease.compartimentPeriodes[this.compartiment] != 0) { //compartiment periode is 0 wnr compartiment oneindig lang duurt
                this.compartiment++; //ga naar volgende fase
                current[this.compartiment - 1]--; //statistieken updaten
                current[this.compartiment]++;

                if (this.compartiment >= disease.compartimentPeriodes.length) {
                    this.compartiment = 0;//loop terug als herinfectie mogelijk is
                    current[3]--; //statistieken updaten
                    current[0]++;
                }

                //bereken hoe lang agents zich in deze fase zal zijn
                let temp = floor(disease.compartimentPeriodes[this.compartiment] * (0.5 + Math.random()));//tussen 50% en 150% van gemiddelde waarde
                this.compartimentTimer = temp;
            }

            //verlaag compartiment timer met 1
            else if (disease.compartimentPeriodes[this.compartiment] != 0) {this.compartimentTimer--;}
        }
    }

    update() {
        //DOEL SELECTIE (berekenen van de acceleratie vector) -------------------------------------------------
        //pas parameters aan (enkel voor antivaxers / anticoronamaatregel mensen)

        //social distancing
        let social = createVector(0, 0)
        if (maatregels.socialDistance == true && this.antiCovid == false) {
            for (let a of agents) {
                if (a == this) continue;

                let d = dist(a.position.x, a.position.y, this.position.x, this.position.y);
                if (d < this.radius) {
                    social.add(this.afstand(a));
                }
            }
            this.acceleration.add(social.mult(this.socialMulti)); //hoe balngrijk social distancing is kan hier bepaald worden
        } else {
            //willekeurig rondlopen
            social = p5.Vector.random2D();
            social.normalize();
            this.acceleration.add(social.mult(this.socialMulti));
        }


        //ga naar de winkel
        if (this.winkelTimer <= 0 && maatregels.winkel == true) {
            //winkel vector
            let v = this.gaNaar(store.x, store.y);
            if (v.mag > 8) {v.setMag(8);} //limiteer hoe groot winkel vector kan zijn
            this.acceleration.add(v.mult(this.winkelMulti)); //hoe balngrijk naarWinkel is kan hier bepaald worden

            //winkeltimer resetten
            let d = dist(this.position.x, this.position.y, store.x, store.y);
            if (d < 15) {
                this.winkelTimer--;

                if (this.winkelTimer == -2) {
                    this.winkelTimer = floor(random(store.min, store.max))
                }
            }

        } 

        //bubbels
        if (maatregels.bubbels == true) {
            if (this.bubbelTimer == 0) {
                //maak bekend dat agent eenzaam is en wil socializen
                eenzameAgents.push(this.agentId);
                this.bubbelTimer = this.bubbelTimer - 1;

            } else if (this.bubbelTimer < -1) {
                if (this.bubbelId >= 0) {
                    //als niet de leider dan ga naar de leider
                    let l = agents[this.bubbelId]; // selecteer leider
                    let v = this.gaNaar(l.position.x, l.position.y);
                    //voeg vector toe aan versnelling
                    if (v.mag > 8) {
                        v.setMag(8);
                    } //limiteer hoe groot vector kan zijn
                    this.acceleration.add(v.mult(this.bubbelMulti)); //kies hoe belangrijk

                    //wanneer dicht genoeg bij leider stop met social distancing
                    //en tel hoe lang je samen blijft
                    let d = dist(l.position.x, l.position.y, this.position.x, this.position.y);
                    if (d < this.radius + 5) {
                        this.socialMulti = 0;
                        l.socialMulti = 0;

                        if (d < this.radius) {
                            this.bubbelMulti = 0; //stop het ronddraaien

                            //tel af en reset
                            this.bubbelTimer = this.bubbelTimer - 1;
                            if (this.bubbelTimer == -2 - bubbels.lengte) { //als sociale interactie gedaan is
                                this.socialMulti = 1;
                                this.bubbelMulti = 1;
                                l.socialMulti = 1;
                                l.bubbelId = l.bubbelId - 1;
                                this.bubbelId = -1;
                                this.bubbelTimer = floor(random(bubbels.min, bubbels.max));
                            }
                        } else {
                            this.bubbelMulti = 1;
                        } //zorg dat ze niet vast komen te zitten
                    }
                } else if (this.bubbelId == -4) {
                    this.bubbelTimer = floor(random(bubbels.min, bubbels.max));
                }

            }
        }


        //vertragen zodat agenten niet constant aan het rondbewegen zijn
        if (this.acceleration.mag() == 0) {this.velocity.mult(0.8)}

        //VOORTBEWEGING ------------------------------------------------------------------------------------
        //voegsnelheid toe aan positie, versnelling aan snelheid en zet versnelling gelijk aan 0
        //limiteer de snelheid en versnelling van de agent
        if (this.acceleration.mag() > 8) {this.acceleration.setMag(8);}
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        if (this.velocity.mag() > 4) {this.velocity.setMag(4);}
        this.acceleration.setMag(0);

        //van wereld een donut maken
        if (this.position.x > width) {this.position.x = 0;}
        if (this.position.x < 0) {this.position.x = width;}
        if (this.position.y > height) {this.position.y = 0;}
        if (this.position.y < 0) {this.position.y = height;}

        //verwijder 1 van de benodighedentimers maar enkel als er geen andere behoefte wordt uitgevoerd
        //if (this.winkelTimer > 0 && !(this.bubbelTimer <= 0) && maatregels.winkel == true) {this.winkelTimer = this.winkelTimer - 1;}
        if (this.bubbelTimer > 0 && !(this.winkelTimer <= 0) && maatregels.bubbels == true) {this.bubbelTimer = this.bubbelTimer - 1;}
    }

    //STUREN -----------------------------------------------------------------------------------------------
    afstand(a) {
        let vector = createVector(0, 0);

            if (a == this) return vector;

            let d = dist(a.position.x, a.position.y, this.position.x, this.position.y);
                //bereken vector die wijst van de agent naar this
                let t = p5.Vector.sub(this.position, a.position);
                //pas grote van de vector aan op basis van afstand
                t.setMag(this.radius / d);
                vector.add(t);

        return vector;
    }

    gaNaar(x, y) {
        //maak vector die naar aangeduid punt wijst
        let vector = createVector(0, 0);
        let doel = createVector(x, y);

        vector.add(doel);
        vector.sub(this.position);

        return vector;
    }
}