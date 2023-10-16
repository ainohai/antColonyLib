"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentType = exports.PheremoneType = exports.AntDecisionModeType = exports.directions = exports.walkerAction = exports.ChoiceType = void 0;
var ChoiceType;
(function (ChoiceType) {
    ChoiceType[ChoiceType["RANDOM"] = 0] = "RANDOM";
    ChoiceType[ChoiceType["SNIFF"] = 1] = "SNIFF";
    ChoiceType[ChoiceType["ANARCHY"] = 2] = "ANARCHY";
    ChoiceType[ChoiceType["UNKNOWN"] = 3] = "UNKNOWN";
})(ChoiceType = exports.ChoiceType || (exports.ChoiceType = {}));
var walkerAction;
(function (walkerAction) {
    walkerAction[walkerAction["FOUND_FOOD"] = 0] = "FOUND_FOOD";
    walkerAction[walkerAction["NESTED_FOOD"] = 1] = "NESTED_FOOD";
    walkerAction[walkerAction["NO_ACTION"] = 2] = "NO_ACTION";
})(walkerAction = exports.walkerAction || (exports.walkerAction = {}));
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
var AgentType;
(function (AgentType) {
    AgentType[AgentType["HOME"] = 0] = "HOME";
    AgentType[AgentType["FOOD"] = 1] = "FOOD";
    AgentType[AgentType["WALKER"] = 2] = "WALKER";
})(AgentType = exports.AgentType || (exports.AgentType = {}));
