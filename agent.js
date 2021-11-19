class agent {

    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.radius = 30
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
        //bereken acceleratie vector
        
        //als versnelling 0 is vertragen zodat agenten niet constant aan het rondbewegen zijn
        if (this.acceleration.mag() == 0) {this.velocity.mult(0.8)}

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
    }

    afstand() {
        let vector = createVector(0, 0);

        for (let a of agents) {
            if (a == this) continue;

            let d = dist(a.position.x, a.position.y, this.position.x, this.position.y);
            if (d < this.radius) {
                //bereken vector die wijst van a naar this
                let t = p5.Vector.sub(this.position, a.position);
                //pas grote van de vector aan op basis van afstand
                t.mult(this.radius / d);
                vector.add(t);
            }
        }

        this.acceleration.add(vector);
    }
}