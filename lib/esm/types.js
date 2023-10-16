export var ChoiceType;
(function (ChoiceType) {
    ChoiceType[ChoiceType["RANDOM"] = 0] = "RANDOM";
    ChoiceType[ChoiceType["SNIFF"] = 1] = "SNIFF";
    ChoiceType[ChoiceType["ANARCHY"] = 2] = "ANARCHY";
    ChoiceType[ChoiceType["UNKNOWN"] = 3] = "UNKNOWN";
})(ChoiceType || (ChoiceType = {}));
export var walkerAction;
(function (walkerAction) {
    walkerAction[walkerAction["FOUND_FOOD"] = 0] = "FOUND_FOOD";
    walkerAction[walkerAction["NESTED_FOOD"] = 1] = "NESTED_FOOD";
    walkerAction[walkerAction["NO_ACTION"] = 2] = "NO_ACTION";
})(walkerAction || (walkerAction = {}));
export const directions = [
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 } //NW
];
export var AntDecisionModeType;
(function (AntDecisionModeType) {
    AntDecisionModeType[AntDecisionModeType["SEARHCING_HOME"] = 0] = "SEARHCING_HOME";
    AntDecisionModeType[AntDecisionModeType["SEARCHING_FOOD"] = 1] = "SEARCHING_FOOD";
    AntDecisionModeType[AntDecisionModeType["ANARCHY"] = 2] = "ANARCHY";
})(AntDecisionModeType || (AntDecisionModeType = {}));
export var PheremoneType;
(function (PheremoneType) {
    PheremoneType[PheremoneType["SUGAR"] = 0] = "SUGAR";
    PheremoneType[PheremoneType["HOME"] = 1] = "HOME";
})(PheremoneType || (PheremoneType = {}));
export var AgentType;
(function (AgentType) {
    AgentType[AgentType["HOME"] = 0] = "HOME";
    AgentType[AgentType["FOOD"] = 1] = "FOOD";
    AgentType[AgentType["WALKER"] = 2] = "WALKER";
})(AgentType || (AgentType = {}));
