import { Coordinate } from "../types";
export declare const getValueWithCoordinate: <A>(oneDimensionalArr: A[], totalColumns: number, x: number, y: number) => A | undefined;
export declare const getIndexWithCoordinate: (totalColumns: number, totalRows: number, x: number, y: number) => number;
export declare const getCoordinateWithIndex: (totalColumns: number, index: number) => Coordinate;
export declare const wrapCoordinateToWorld: (totalCols: number, totalRows: number, coordinate: Coordinate) => Coordinate;
//# sourceMappingURL=coordinateUtil.d.ts.map