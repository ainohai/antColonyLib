
export type Direction = {
    x: -1 | 0 | 1, 
    y: -1 | 0 | 1
}

export const directions: (Readonly<Direction>)[] = [
    { x: 0, y: -1 }, //N
    { x: 1, y: -1 }, //NE
    { x: 1, y: 0 }, //E
    { x: 1, y: 1 }, //SE
    { x: 0, y: 1 }, //S
    { x: -1, y: 1 }, //SW
    { x: -1, y: 0 }, //W,
    { x: -1, y: -1 } //NW
];

export const directionsWithIndex = (currentAngle: number): Direction => {
    return directions[currentAngle];
}

export const toLeft = (currentAngle: number, steps: number): number => {
    return currentAngle >= steps ? currentAngle - steps : directions.length - (steps - currentAngle);
}

export const toRight = (currentAngle: number, steps: number): number => {
    return (currentAngle + steps) % directions.length;
}

