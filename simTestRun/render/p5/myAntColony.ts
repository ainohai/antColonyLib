import * as P5 from 'p5';
import * as dat from 'dat.gui';
import { Ant, AntState, AntDecisionModeType, PheremoneRules, SimulationWorld, ChoiceType, ConfigType, createSimulation, getStaticParams, ParametersType, setVariableParams, Simulation, PheremoneType, AgentType } from '../../../src'
import { Pheremone } from '../../../src/types';


export const staticParameters: Readonly<ParametersType> = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_WALKERS: 700,
}


export let walkerConfig: ConfigType;


let sim: Simulation;

export let p5: P5;



export enum Mode {
    WALKER,
    FOODPHEREMONE,
    HOMEPHEREMONE
}

let drawMode = Mode.WALKER;

//export const changeMode = () => drawMode = (drawMode + 1) % 5

export const pickMode = (modeIndex) => {
    console.log("Changed to mode: " + modeIndex); drawMode = modeIndex; let bgColor = p5.color('#000000');
    p5.background(bgColor); p5.frameRate(25);
}


const sketch = function (p5Ins: P5) {

    p5 = p5Ins;

    p5.setup = () => {
        p5.createCanvas(staticParameters.COLUMNS, staticParameters.ROWS);
        p5.frameRate(25);

        walkerConfig = {
            walkerLifespan: 10000,
            sight: 6,
            pheremoneRules: {
                [PheremoneType.SUGAR]: {
                    walkerDecay: 0.007,
                    cellDecay: 0.0005, 
                    weight: 20,
                    maxPheremone: 100,
                    goodScoreThreshold: 0.004
                },
                [PheremoneType.HOME]: {
                        walkerDecay: 0.007,
                        cellDecay: 0.0007, 
                        weight: 20,
                        maxPheremone: 100,
                        goodScoreThreshold: 0.2
                    }
                },    
            walkerAnarchyRandomPercentage: 0.005, //chance not to move where you should
            moveForwardPercentage: 0.25, // When seeking food. walkers are this likely to just move forward, otherwise they will select random 
        }
        
        setVariableParams(walkerConfig);
        sim = createSimulation({ COLUMNS: p5.width, ROWS: p5.height });


    }

    p5.draw = () => {

        const state = sim.run();
        draw(state);

        if (p5.frameCount > 10000) {
            p5.noLoop();
        }

    }

    const draw = (state: { world: SimulationWorld }) => {

        const start = performance.now();

        let homeColor = p5.color('#31536b');
        let foodColor = p5.color('#75b8c8');
        let bgColor = p5.color('#000000');

        if (drawMode === Mode.WALKER) {
            p5.background(bgColor);
        }

        p5.noStroke();

        let home = state.world.getHomeIndexes()
        let foods = state.world.getFoodIndexes();

        const cells = state.world.cells;
        let max = 0

       /* if (p5.frameCount % 100 === 0) {
            cells.forEach(cell => {
                max = max < cell.pheremones[0] ? cell.pheremones[0] : max;
            })
            cells.forEach(cell => {
                max = max < cell.pheremones[0] ? cell.pheremones[0] : max;
            })
        }
*/

        //if (drawMode === Mode.walker || drawMode === Mode.CHOICE) {
            p5.fill(homeColor);
            p5.ellipse(home[0], home[1], 5, 5);


            p5.fill(foodColor);
            for (var i = 0; i < foods.length; i++) {
                let f = foods[i];
                p5.ellipse(f[0], f[1], 2, 2);
            }
        //}

        //if (p5.frameCount % 10 === 0){
        //    state.world.debugDrawCells(p5);
        if (drawMode === Mode.WALKER) {
            let ants = state.world.getType(AgentType.WALKER) as Ant[];
            for (var i = 0; i < ants.length; i++) {
                let a = ants[i];
                
                var walkerColor = p5.color('#000000');
                if (a.isDead) {
                    walkerColor = p5.color('#CCCCCC');
                } else if (a.state.lastChoice === ChoiceType.ANARCHY) {
                    walkerColor = p5.color('#CC00CC');
                } else if ((a.state as AntState).mode === AntDecisionModeType.SEARHCING_HOME) {
                    const green = "#00e300";
                    walkerColor = p5.color(green);
                    if (a.state.lastChoice === ChoiceType.SNIFF) {
                        const yellow = "#00ff00";
                        walkerColor = p5.color(yellow);
                    }
                } else if ((a.state as AntState).mode === AntDecisionModeType.SEARCHING_FOOD) {
                    const purple = "#ac0000";
                    walkerColor = p5.color(purple);
                    if (a.state.lastChoice === ChoiceType.SNIFF) {
                        const blue = "#ff0000";
                        walkerColor = p5.color(blue);
                    }
                } else {
                    walkerColor = p5.color('#6D02D9');
                    if (a.state.lastChoice === ChoiceType.SNIFF) {
                        walkerColor = p5.color('#026DD9');
                    }
                }
                p5.fill(walkerColor);
                p5.rect(a.location[0], a.location[1], 2, 2);
                //console.dir(state.world.getCell(a.location[0], a.location[1]));
            }
        }
    
        const end = performance.now();

        //console.log(`${end-start}`)

       /* if (p5.frameCount % 20 === 10) {
            p5.background(bgColor);
            debugDrawCells(state.world);
        }*/

        if (drawMode === Mode.FOODPHEREMONE && p5.frameCount % 20 === 10) {
            p5.background(bgColor);
            debugFoodPheremone(state.world);
        }
        if (drawMode === Mode.HOMEPHEREMONE && p5.frameCount % 20 === 10) {
            p5.background(bgColor);
            debugHomePheremone(state.world);
        }
    }


const debugDrawCells = (world) => {

world.cells.forEach(ce => ce.touchPheromones(p5.frameCount))
const cells = world.cells;

for (var i = 0; i < cells.length; i += 1) {
    let c = cells[i];
    const x = Math.floor(i % 500);
    const y = Math.floor(i / 500);

    let pher = c.homePheremone;
    pher = p5.map(pher, 0, 100, 0, 255);
    let pher2 = c.foodPheremone;
    pher2 = p5.map(pher2, 0, 30, 0, 255);

    if (c.type == 0) { //|| c.foodPheremone > 0) {



        let newColor = p5.color(pher, pher2, 0); //p5.lerpColor(bgColor, pheremoneColor, p5.norm(c.homePheremone + c.foodPheremone, 0, 1));
        p5.fill(newColor);
        p5.rect(x, y, 1, 1);

    }
}
}

const debugFoodPheremone = (world) => {

world.cells.forEach(ce => ce.touchPheromones(p5.frameCount))
const cells = world.cells;

for (var i = 0; i < cells.length; i += 1) {
    let c = cells[i];
    const x = Math.floor(i % 500);
    const y = Math.floor(i / 500);

    let pher = c.pheremones[0] ?? 0;
    pher = p5.map(pher, 0, 1, 0, 255);

    if (pher > 0) {

    let newColor = p5.color(0, 0, pher); //p5.lerpColor(bgColor, pheremoneColor, p5.norm(c.homePheremone + c.foodPheremone, 0, 1));
    p5.fill(newColor);
    p5.rect(x, y, 1, 1);
    }

}
}

const debugHomePheremone = (world) => {

world.cells.forEach(ce => ce.touchPheromones(p5.frameCount))
const cells = world.cells;

for (var i = 0; i < cells.length; i += 1) {
    let c = cells[i];
    const x = Math.floor(i % 500);
    const y = Math.floor(i / 500);

    let pher = c.pheremones[1] ?? 0;
    pher = p5.map(pher, 0, 5, 0, 255);

    if (pher > 0) {

        let newColor = p5.color(pher, 0, 0); //p5.lerpColor(bgColor, pheremoneColor, p5.norm(c.homePheremone + c.foodPheremone, 0, 1));
        p5.fill(newColor);
        p5.rect(x, y, 1, 1);
    }

}
}


    p5.mouseClicked = () => {

        drawMode = (drawMode +1) % 3

        const stat = getStaticParams();
        if (stat.COLUMNS > p5.mouseX && stat.ROWS > p5.mouseY) {
            const foo = sim.getState().world;
            const cell = foo.getCell(p5.round(p5.mouseX), p5.round(p5.mouseY));
            console.log(cell);
        }

    }
}
 

export const render = function () {
    if (!!p5) { p5.remove() }
    let p5Instance = new P5(sketch, document.getElementById('p5-container') ?? undefined);

}