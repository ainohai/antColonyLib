
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

export const directionsForward = (currentAngle: number): Direction => {
    return directions[currentAngle];
}

export const directionsLeft = (currentAngle: number): Direction => {
    let directionsLeft = currentAngle - 1;
    if (directionsLeft < 0) {
        directionsLeft = directions.length - 1;
    }

    return directions[directionsLeft];
}

export const directionsRight = (currentAngle: number): Direction => {
    const directionsRight = (currentAngle + 1) % directions.length;
    return directions[directionsRight]
}

