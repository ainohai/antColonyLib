export declare type Direction = {
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
};
export declare const directions: (Readonly<Direction>)[];
export declare const directionsForward: (currentAngle: number) => Direction;
export declare const directionsLeft: (currentAngle: number) => Direction;
export declare const directionsRight: (currentAngle: number) => Direction;
//# sourceMappingURL=directions.d.ts.map