export declare type Direction = {
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
};
export declare const directions: (Readonly<Direction>)[];
export declare const directionsWithIndex: (currentAngle: number) => Direction;
export declare const toLeft: (currentAngle: number, steps: number) => number;
export declare const toRight: (currentAngle: number, steps: number) => number;
//# sourceMappingURL=directions.d.ts.map