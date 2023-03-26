"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapCoordinateToWorld = exports.getCoordinateWithIndex = exports.getIndexWithCoordinate = exports.getValueWithCoordinate = void 0;
const isOnWorld = (val, max) => (val < max && val >= 0);
const fixCoordinate = (value, maxValue) => {
    if (value < 0) {
        value = (maxValue - 1) + value;
    }
    else if (value >= (maxValue)) {
        value = Math.floor(value % maxValue);
    }
    return value;
};
const getValueWithCoordinate = (oneDimensionalArr, totalColumns, x, y) => {
    const totalRows = Math.ceil(oneDimensionalArr.length / totalColumns);
    const index = (0, exports.getIndexWithCoordinate)(totalColumns, totalRows, x, y);
    return index != undefined && oneDimensionalArr.length > index ? oneDimensionalArr[index] : undefined;
};
exports.getValueWithCoordinate = getValueWithCoordinate;
const getIndexWithCoordinate = (totalColumns, totalRows, x, y) => {
    let index = totalColumns > y && totalRows > x ? Math.floor(totalColumns * y) + x : undefined;
    if (index === undefined) {
        throw Error(`Trying to access illegal index at (${x},${y})`);
    }
    return index;
};
exports.getIndexWithCoordinate = getIndexWithCoordinate;
//Does not ensure that index exists in the array.
const getCoordinateWithIndex = (totalColumns, index) => {
    const x = Math.floor(index % totalColumns);
    const y = Math.floor(index / totalColumns);
    return [x, y];
};
exports.getCoordinateWithIndex = getCoordinateWithIndex;
//Changes the original value.
const wrapCoordinateToWorld = (totalCols, totalRows, coordinate) => {
    if (!isOnWorld(coordinate[0], totalCols)) {
        coordinate[0] = fixCoordinate(coordinate[0], totalCols);
    }
    if (!isOnWorld(coordinate[1], totalRows)) {
        coordinate[1] = fixCoordinate(coordinate[1], totalRows);
    }
    return coordinate;
};
exports.wrapCoordinateToWorld = wrapCoordinateToWorld;
