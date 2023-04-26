"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modeActions = void 0;
const antConfig_1 = require("../config/antConfig");
const scoring_1 = require("../logic/scoring");
const types_1 = require("../types");
class AntActions {
    constructor(searchingFor, followingTrail, percentageOfForward, percentageOfRandomWhenOnTrail, goodScoreTreshold) {
        this.searchingFor = searchingFor;
        this.followingTrail = followingTrail;
        this.percentageOfForward = percentageOfForward;
        this.percentageOfRandomWhenOnTrail = percentageOfRandomWhenOnTrail;
        this.goodScoreTreshold = goodScoreTreshold;
    }
    chosen(ant, world, tick) {
        const scores = (0, scoring_1.scoreDirections)(ant, world, tick, this.score.bind(this));
        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score; });
        const isRandom = scores[0].score < this.goodScoreTreshold;
        let chosen = isRandom ? this.selectRandom(scores, forward) : this.followTrail(scores);
        chosen.choiceType = isRandom ? types_1.ChoiceType.RANDOM : types_1.ChoiceType.SNIFF;
        return chosen;
    }
    selectRandom(scores, forward) {
        if (!!this.percentageOfForward && Math.random() < this.percentageOfForward) {
            return forward;
        }
        const positiveScores = scores.filter(s => s.score >= 0);
        const randomIndex = Math.floor(Math.random() * positiveScores.length);
        return positiveScores[randomIndex];
    }
    followTrail(scores) {
        //Small change of selecting random when following trail.
        if (!!this.percentageOfRandomWhenOnTrail && Math.random() < this.percentageOfRandomWhenOnTrail) {
            const positiveScores = scores.filter(s => s.score >= 0);
            const randomIndex = Math.floor(Math.random() * positiveScores.length);
            return positiveScores[randomIndex];
        }
        return scores[0];
    }
    score(ant, cell, tick) {
        if (cell.type === this.searchingFor) {
            //console.log("seeing home")
            return Number.MAX_VALUE;
        }
        else {
            return this.followingTrail === types_1.PheremoneType.HOME ? cell.homePheremone : cell.foodPheremone;
        }
    }
}
class ForcedDirection {
    chosen(ant, world, tick) {
        const chosen = (0, scoring_1.getScoreForDirection)(ant.currentAngle, ant, world, tick, () => 0);
        chosen.choiceType = types_1.ChoiceType.ANARCHY;
        return chosen;
    }
}
const createModes = () => {
    //This smarter, please. 
    const SearchFood = new AntActions(types_1.CellStates.FOOD, types_1.PheremoneType.SUGAR, (0, antConfig_1.antConfig)().moveForwardPercentage, 0.01, (0, antConfig_1.antConfig)().goodFoodScoreTreshold);
    const SearchHome = new AntActions(types_1.CellStates.HOME, types_1.PheremoneType.HOME, (0, antConfig_1.antConfig)().moveForwardPercentage, 0.01, (0, antConfig_1.antConfig)().goodHomeScoreTreshold);
    const Anarchy = new ForcedDirection();
    //order needs to be the same as in AntDecisionModeType!
    return [SearchHome, SearchFood, Anarchy];
};
let modes;
const modeActions = (mode) => {
    if (!modes) {
        modes = createModes();
    }
    return modes[mode];
};
exports.modeActions = modeActions;
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
