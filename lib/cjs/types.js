"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PheremoneType = exports.AntDecisionModeType = exports.directions = exports.AntAction = exports.ChoiceType = exports.CellStates = void 0;
var CellStates;
(function (CellStates) {
    CellStates[CellStates["EMPTY"] = 0] = "EMPTY";
    CellStates[CellStates["FOOD"] = 1] = "FOOD";
    CellStates[CellStates["HOME"] = 2] = "HOME";
})(CellStates = exports.CellStates || (exports.CellStates = {}));
;
var ChoiceType;
(function (ChoiceType) {
    ChoiceType[ChoiceType["RANDOM"] = 0] = "RANDOM";
    ChoiceType[ChoiceType["SNIFF"] = 1] = "SNIFF";
    ChoiceType[ChoiceType["ANARCHY"] = 2] = "ANARCHY";
    ChoiceType[ChoiceType["UNKNOWN"] = 3] = "UNKNOWN";
})(ChoiceType = exports.ChoiceType || (exports.ChoiceType = {}));
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
var AntDecisionModeType;
(function (AntDecisionModeType) {
    AntDecisionModeType[AntDecisionModeType["SEARHCING_HOME"] = 0] = "SEARHCING_HOME";
    AntDecisionModeType[AntDecisionModeType["SEARCHING_FOOD"] = 1] = "SEARCHING_FOOD";
    AntDecisionModeType[AntDecisionModeType["ANARCHY"] = 2] = "ANARCHY";
})(AntDecisionModeType = exports.AntDecisionModeType || (exports.AntDecisionModeType = {}));
var PheremoneType;
(function (PheremoneType) {
    PheremoneType[PheremoneType["SUGAR"] = 0] = "SUGAR";
    PheremoneType[PheremoneType["HOME"] = 1] = "HOME";
})(PheremoneType = exports.PheremoneType || (exports.PheremoneType = {}));
