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
export const directionsWithIndex = (currentAngle) => {
    return directions[currentAngle];
};
export const toLeft = (currentAngle, steps) => {
    return currentAngle >= steps ? currentAngle - steps : directions.length - (steps - currentAngle);
};
export const toRight = (currentAngle, steps) => {
    return (currentAngle + steps) % directions.length;
};
