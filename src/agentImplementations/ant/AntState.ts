import { walkerConfig } from "../../config/walkerConfig";
import { scoreBestDirection } from "../../logic/scoring";
import { AgentType, AntDecisionModeType, ChoiceType, Coordinate, DirectionScore, PheremoneType } from "../../types"
import { Walker } from "../../entities/Walker";
import { Cell, SimulationWorld } from "../../entities/World";
import { getIndexWithCoordinate, wrapCoordinateToWorld } from "../../utils/coordinateUtil";
import { directions } from "../../logic/directions";
import { Ant } from "./Ant";


interface WalkerModeActions {
    choose: (ant: Walker, world: SimulationWorld, tick: number) => DirectionScore | undefined
}
class AntActions implements WalkerModeActions {
    private searchingFor: AgentType;
    private followingTrail: PheremoneType;
    private percentageOfForward: number;
    private percentageOfRandomWhenOnTrail: number;
    private goodScoreTreshold: number;

    constructor(searchingFor: AgentType, followingTrail: PheremoneType,
        percentageOfForward: number, percentageOfRandomWhenOnTrail: number, goodScoreTreshold: number){
            
        this.searchingFor = searchingFor;
        this.followingTrail = followingTrail;
        this.percentageOfForward = percentageOfForward;
        this.percentageOfRandomWhenOnTrail = percentageOfRandomWhenOnTrail;
        this.goodScoreTreshold = goodScoreTreshold;

    }

    choose(ant: Walker, world: SimulationWorld, tick: number) {

        const score = (ant: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld): number => {
        
            const cell = world.getCell(coordinate[0], coordinate[1]);
    
            if (!cell) {
                throw "There is no cell"
            }
    
            const agents = world.getTypeFromCell(ant.pheremone.type === PheremoneType.SUGAR ? AgentType.HOME : AgentType.FOOD, coordinate)
            const phetype = ant.pheremone.type === PheremoneType.SUGAR ? PheremoneType.HOME : PheremoneType.SUGAR;
            const pheStarting = ant.pheremone.pickedUpPheremoneOnTick;

           let bonus = 0;

            if (agents.length > 0) {
                //console.log("seeing home")
                bonus = 10000;
            }else if (cell.addedOnTick > 3) {
                bonus = -100;
            } 
            
            const pherValue = ant.pheremone.type === PheremoneType.SUGAR ? cell.pheremones[PheremoneType.HOME] : cell.pheremones[PheremoneType.SUGAR];
            
            return pherValue + bonus > 0 ? pherValue + bonus : 0 
            
    
        }
    

        const best =  scoreBestDirection(ant, world, tick, score);

        //const forward = scores[0];
        //scores.sort((o1, o2) => { return o2.score - o1.score});
        
        //const isRandom = scores[0].score < this.goodScoreTreshold
        //let chosen =  isRandom ? this.selectRandom(scores, forward) : this.followTrail(scores);
        
        let chosen: DirectionScore =  best;


        if (!!this.percentageOfRandomWhenOnTrail && Math.random() < this.percentageOfRandomWhenOnTrail) {
            
            const randomIndex = Math.floor(Math.random() * directions.length);
            chosen =  { direction: randomIndex, score: 0};
        }

        //chosen.choiceType = isRandom ? ChoiceType.RANDOM : ChoiceType.SNIFF;
        chosen.choiceType = ChoiceType.SNIFF;
        
        return chosen;

    }
    selectRandom(scores: DirectionScore[], forward: DirectionScore): DirectionScore {
        if (!!this.percentageOfForward && Math.random() < this.percentageOfForward) {
            return forward;
        }

        const positiveScores = scores.filter(s => s.score >= 0);
        const randomIndex = Math.floor(Math.random() * positiveScores.length);
        return positiveScores[randomIndex];
    }

    score (ant: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld): number {
        
        const cell = world.getCell(coordinate[0], coordinate[1]);

        if (!cell) {
            throw "There is no cell"
        }

        const agents = world.getTypeFromCell(ant.pheremone.type === PheremoneType.SUGAR ? AgentType.HOME : AgentType.FOOD, coordinate)

        if (agents.length > 0) {
            //console.log("seeing home")
            return Number.MAX_VALUE;
        /*} else if ((ant as Ant).history.filter(h => h[0] === coordinate[0] && h[1] === coordinate[1]).length > 0) {
            return Number.MIN_VALUE;
        */} else {
            const pherValue = ant.pheremone.type === PheremoneType.SUGAR ? cell.pheremones[PheremoneType.HOME] : cell.pheremones[PheremoneType.SUGAR];
            return pherValue ?? 0 
        }

    }
}

class ForcedDirection implements WalkerModeActions {
    

    choose(ant: Walker, world: SimulationWorld, tick: number) {
       
        const chosen = scoreBestDirection(ant, world, tick, () => 0);
        console.log("anarchy")
        chosen.choiceType = ChoiceType.ANARCHY;
        return chosen;
        
    }
}



const createModes = (): WalkerModeActions[] => {
    //This smarter, please. 
    const SearchFood =  new AntActions(AgentType.FOOD, PheremoneType.SUGAR, walkerConfig().moveForwardPercentage, 0.01, walkerConfig().pheremoneRules[PheremoneType.SUGAR].goodScoreThreshold);
    const SearchHome = new AntActions(AgentType.HOME, PheremoneType.HOME, walkerConfig().moveForwardPercentage, 0.01, walkerConfig().pheremoneRules[PheremoneType.HOME].goodScoreThreshold);
    const Anarchy = new ForcedDirection();

    //order needs to be the same as in AntDecisionModeType!
    return [SearchHome, SearchFood, Anarchy]
}

let modes:  WalkerModeActions[] | undefined;

export const modeActions = (mode: AntDecisionModeType) => {
    if (!modes) {
        modes = createModes();
    }
    return modes[mode];
}




    /*    const scores =  score(this, world, tick, actions.scoreCell);

        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score});
        
        let chosen: DirectionScore|undefined = scores[0];
       
*/

/*if (this.hasAnarchy > 0) {
    chosen = forward;
    this.hasAnarchy = this.hasAnarchy - 1;
    this.lastChoice = LastChoice.ANARCHY;
}

//Ant goes forward/random, unless good enough score is found aka treshold bigger than score
else if (((this.state === AntState.SEARCH_FOOD ? 1 : 0.5) * antConfig().goodScoreTreshold) >= chosen.score) {
    this.lastChoice = LastChoice.RANDOM;

    chosen = Math.random() <= antConfig().moveForwardPercentage && forward.score >= 0 ? forward : randomDirection;

}

if (antState === AntState.SEARCH_FOOD) {
    if (c.type === CellStates.FOOD) {
        //If it's food, we don't care about pheremones
        return Number.MAX_VALUE
    } else {
        return c.foodPheremone;
    }
}

const scores =  this.score(this.currentAngle, world, tick);

const forward = scores[0];
scores.sort((o1, o2) => { return o2.score - o1.score});

let chosen: DirectionScore|undefined = scores[0];


this.lastChoice = LastChoice.SNIFF;    


if (this.hasAnarchy > 0) {
    chosen = forward;
    this.hasAnarchy = this.hasAnarchy - 1;
    this.lastChoice = LastChoice.ANARCHY;
}

//Ant goes forward/random, unless good enough score is found aka treshold bigger than score
else if (((this.state === AntState.SEARCH_FOOD ? 1 : 0.5) * antConfig().goodScoreTreshold) >= chosen.score) {
    this.lastChoice = LastChoice.RANDOM;

    chosen = Math.random() <= antConfig().moveForwardPercentage && forward.score >= 0 ? forward : randomDirection;

}

*/