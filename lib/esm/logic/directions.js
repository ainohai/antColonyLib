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
export const directionsForward = (currentAngle) => {
    return directions[currentAngle];
};
export const directionsLeft = (currentAngle) => {
    let directionsLeft = currentAngle - 1;
    if (directionsLeft < 0) {
        directionsLeft = directions.length - 1;
    }
    return directions[directionsLeft];
};
export const directionsRight = (currentAngle) => {
    const directionsRight = (currentAngle + 1) % directions.length;
    return directions[directionsRight];
};
