class agent {

    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
    }

    show() {
        push();
        stroke(255);
        strokeWeight(8);
        point(this.position.x, this.position.y);
        pop();
    }

    update() {
        //voegsnelheid toe aan positie, versnelling aan snelheid en zet versnelling gelijk aan 0
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);
        //versnelling wordt altijd ge reset omdat we elk frame een unieke versnelling willen op basis van verschillende factoren
    }
}