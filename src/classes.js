class State {

    controlPointMapping = {
        fc: "Femur Center",
        hc: "Hip Center",
        fpc: "Femur Proximal Canal",
        fdc: "Femur Distal Canal",
        me: "Medial Epicondyle",
        le: "Lateral Epicondyle",
        dmp: "Distal Medial Pt",
        dlp: "Distal Lateral Pt",
        pmp: "Posterior Medial Pt",
        plp: "Posterior Lateral Pt",
    };

    controlPoints = {}
    points = {}
    lines = {}
    planes = {}
    activeControlPoint = undefined

    varusRotation = 0
    flexionRotation = 0

    defaultIncrement = 1

    distalResection = 10 // in mm

    reRenderDOMControlPoints = false
    worldNeedsUpdate = true
    enableClipping = false

    constructor() {
        // This was done because I didn't want to copy paste keys into the object :D
        Object.keys(this.controlPointMapping).forEach((controlPoint) => {
            this.controlPoints[controlPoint] = undefined
        });
    }

    setControlPoint(controlPoint, value) {
        this.controlPoints[controlPoint] = value
        // Rebuilds the overlay to display colors beside the radio button
        this.reRenderDOMControlPoints = true
        this.worldNeedsUpdate = true
    }

    changeVarusRotation(sign) {
        this.varusRotation += sign === '+' ? this.defaultIncrement : -1*this.defaultIncrement;
        this.worldNeedsUpdate = true
    }

    changeFlexionRotation(sign) {
        this.flexionRotation += sign === '+' ? this.defaultIncrement : -1*this.defaultIncrement;
        this.worldNeedsUpdate = true
    }

    toggleClipping(){
        this.enableClipping = !this.enableClipping
        this.worldNeedsUpdate = true
    }

    changeDistalResection(sign){
        this.distalResection += sign === '+' ? this.defaultIncrement : -1*this.defaultIncrement;
        this.worldNeedsUpdate = true
    }
}

export let state = new State()