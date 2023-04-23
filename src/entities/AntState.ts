
import { antConfig } from "../config/antConfig";
import { getScoreForDirection, scoreDirections } from "../logic/scoring";
import { AntDecisionModeType, CellStates, ChoiceType, DirectionScore, PheremoneType } from "../types"
import { Ant } from "./Ant";
import { AntWorld, Cell } from "./World";


interface AntModeActions {
    chosen: (ant: Ant, world: AntWorld, tick: number) => DirectionScore | undefined
}
class AntActions implements AntModeActions {
    private searchingFor: CellStates;
    private followingTrail: PheremoneType;
    private percentageOfForward: number;
    private percentageOfRandomWhenOnTrail: number;
    private goodScoreTreshold: number;

    constructor(searchingFor: CellStates, followingTrail: PheremoneType,
        percentageOfForward: number, percentageOfRandomWhenOnTrail: number, goodScoreTreshold: number){
            
        this.searchingFor = searchingFor;
        this.followingTrail = followingTrail;
        this.percentageOfForward = percentageOfForward;
        this.percentageOfRandomWhenOnTrail = percentageOfRandomWhenOnTrail;
        this.goodScoreTreshold = goodScoreTreshold;

    }

    chosen(ant: Ant, world: AntWorld, tick: number) {

        const scores =  scoreDirections(ant, world, tick, this.score);

        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score});
        
        const isRandom = scores[0].score < this.goodScoreTreshold
        let chosen =  isRandom ? this.selectRandom(scores, forward) : this.followTrail(scores);

        chosen.choiceType = isRandom ? ChoiceType.RANDOM : ChoiceType.SNIFF;
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
    
    followTrail(scores: DirectionScore[]): DirectionScore {
        //Small change of selecting random when following trail.
        if (!!this.percentageOfRandomWhenOnTrail && Math.random() < this.percentageOfRandomWhenOnTrail) {
            const positiveScores = scores.filter(s => s.score >= 0);
            const randomIndex = Math.floor(Math.random() * positiveScores.length);
            return positiveScores[randomIndex];
        }
        return scores[0];
    }

    score(ant: Ant, cell: Cell, tick: number) {
        if (cell.type === this.searchingFor) {
            //console.log("seeing home")
            return Number.MAX_VALUE;
        } else {
            return cell.pheremones[this.followingTrail];
        }

    }
}

class ForcedDirection implements AntModeActions {
    private forcedDirection: number; //index of forced direction
    
    constructor(forcedDirection: number){
            
        this.forcedDirection = forcedDirection;

    }

    chosen(ant: Ant, world: AntWorld, tick: number) {
       
        const chosen = getScoreForDirection(this.forcedDirection, ant, world, tick, () => 0);
        chosen.choiceType = ChoiceType.ANARCHY;
        return chosen;
        
    }
}


const SearchFood = new AntActions(CellStates.FOOD, PheremoneType.SUGAR, antConfig().moveForwardPercentage, 0.01, antConfig().goodScoreTreshold);
 
const SearchHome = new AntActions(CellStates.HOME, PheremoneType.HOME, antConfig().moveForwardPercentage, 0.01, antConfig().goodScoreTreshold);

const Anarchy = new ForcedDirection(0);


const modes = [SearchFood, SearchHome, Anarchy]

export const modeActions = (mode: AntDecisionModeType) => {
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