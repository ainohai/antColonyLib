"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRight = exports.toLeft = exports.directionsWithIndex = exports.directions = void 0;
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
const directionsWithIndex = (currentAngle) => {
    return exports.directions[currentAngle];
};
exports.directionsWithIndex = directionsWithIndex;
const toLeft = (currentAngle, steps) => {
    return currentAngle >= steps ? currentAngle - steps : exports.directions.length - (steps - currentAngle);
};
exports.toLeft = toLeft;
const toRight = (currentAngle, steps) => {
    return (currentAngle + steps) % exports.directions.length;
};
exports.toRight = toRight;
