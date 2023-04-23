import { antConfig } from "../config/antConfig";
import { Pheremone, PheremoneType } from "../types";

let sugarPheremone: Pheremone;
let homePheremone: Pheremone;


const pheremoneFactory = (type: PheremoneType): Readonly<Pheremone> => {

    if (type === PheremoneType.HOME) {
        return {
            type: type,
            pheremoneCellDecay: () => antConfig().homePheremoneDecay,
            pheremoneAntDecay: () => antConfig().antHomePheremoneDecay,
            goodScoreThreshold: () => antConfig().goodScoreTreshold
        }
    }
    else if (type === PheremoneType.SUGAR) {
        return {
            type: type,
            pheremoneCellDecay: () => antConfig().foodPheremoneDecay,
            pheremoneAntDecay: () => antConfig().antFoodPheremoneDecay,
            goodScoreThreshold: () => antConfig().goodScoreTreshold
        }
    }
    throw "Not known pheremone"
}


export const pheremones = (): Pheremone[] => {
    if (!sugarPheremone) {
        sugarPheremone = pheremoneFactory(PheremoneType.SUGAR);
    }
    if (!homePheremone) {
        homePheremone = pheremoneFactory(PheremoneType.HOME);
    }
    return [sugarPheremone, homePheremone]
}