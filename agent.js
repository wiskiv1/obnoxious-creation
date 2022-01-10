class agent {

    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.radius = afstandStraal;
        this.socialMulti = 1;
        this.winkelTimer = floor(random(0, store.max));
        this.winkelMulti = 0.75;
        this.bubbelTimer = floor(random(0, bubbels.max));
        this.bubbelMulti = 1;
    }

    show() {
        push();
        stroke(255);
        strokeWeight(8);
        point(this.position.x, this.position.y);
        fill(0, 0);
        strokeWeight(1);
        //circle(this.position.x, this.position.y, 25)
        pop();
    }

    update() {
        //DOEL SELECTIE (berekenen van de acceleratie vector) -------------------------------------------------
        //social distancing
        let social = createVector(0, 0)
        for (let a of agents) {
            if (a == this) continue;

            let d = dist(a.position.x, a.position.y, this.position.x, this.position.y);
            if (d < this.radius) {
                social.add(this.afstand(a));
            }
        }
        this.acceleration.add(social.mult(this.socialMulti)); //hoe balngrijk social distancing is kan hier bepaald worden


        //ga naar de winkel
        if (this.winkelTimer <= 0) {
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

        //als versnelling 0 is vertragen zodat agenten niet constant aan het rondbewegen zijn
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

        //verwijder 1 van de benodigheden
        if (this.winkelTimer > 0) {this.winkelTimer = this.winkelTimer - 1;}
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