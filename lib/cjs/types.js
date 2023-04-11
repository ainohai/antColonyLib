"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directions = exports.AntAction = exports.AntState = exports.LastChoice = exports.CellStates = void 0;
var CellStates;
(function (CellStates) {
    CellStates[CellStates["EMPTY"] = 0] = "EMPTY";
    CellStates[CellStates["FOOD"] = 1] = "FOOD";
    CellStates[CellStates["HOME"] = 2] = "HOME";
})(CellStates = exports.CellStates || (exports.CellStates = {}));
;
var LastChoice;
(function (LastChoice) {
    LastChoice[LastChoice["ANARCHY"] = 0] = "ANARCHY";
    LastChoice[LastChoice["SNIFF"] = 1] = "SNIFF";
    LastChoice[LastChoice["RANDOM"] = 2] = "RANDOM";
})(LastChoice = exports.LastChoice || (exports.LastChoice = {}));
var AntState;
(function (AntState) {
    AntState[AntState["SEARCH_FOOD"] = 0] = "SEARCH_FOOD";
    AntState[AntState["CARRY_FOOD"] = 1] = "CARRY_FOOD";
})(AntState = exports.AntState || (exports.AntState = {}));
var AntAction;
(function (AntAction) {
    AntAction[AntAction["FOUND_FOOD"] = 0] = "FOUND_FOOD";
    AntAction[AntAction["NESTED_FOOD"] = 1] = "NESTED_FOOD";
    AntAction[AntAction["NO_ACTION"] = 2] = "NO_ACTION";
})(AntAction = exports.AntAction || (exports.AntAction = {}));
exports.directions = [
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 } //NW
];
