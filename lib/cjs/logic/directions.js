"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directionsRight = exports.directionsLeft = exports.directionsForward = exports.directions = void 0;
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
const directionsForward = (currentAngle) => {
    return exports.directions[currentAngle];
};
exports.directionsForward = directionsForward;
const directionsLeft = (currentAngle) => {
    let directionsLeft = currentAngle - 1;
    if (directionsLeft < 0) {
        directionsLeft = exports.directions.length - 1;
    }
    return exports.directions[directionsLeft];
};
exports.directionsLeft = directionsLeft;
const directionsRight = (currentAngle) => {
    const directionsRight = (currentAngle + 1) % exports.directions.length;
    return exports.directions[directionsRight];
};
exports.directionsRight = directionsRight;
