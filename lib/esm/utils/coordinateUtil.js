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
export const getValueWithCoordinate = (oneDimensionalArr, totalColumns, x, y) => {
    const totalRows = Math.ceil(oneDimensionalArr.length / totalColumns);
    const index = getIndexWithCoordinate(totalColumns, totalRows, x, y);
    return index != undefined && oneDimensionalArr.length > index ? oneDimensionalArr[index] : undefined;
};
export const getIndexWithCoordinate = (totalColumns, totalRows, x, y) => {
    let index = totalColumns > y && totalRows > x ? Math.floor(totalColumns * y) + x : undefined;
    if (index === undefined) {
        throw Error(`Trying to access illegal index at (${x},${y})`);
    }
    return index;
};
//Does not ensure that index exists in the array.
export const getCoordinateWithIndex = (totalColumns, index) => {
    const x = Math.floor(index % totalColumns);
    const y = Math.floor(index / totalColumns);
    return [x, y];
};
//Changes the original value.
export const wrapCoordinateToWorld = (totalCols, totalRows, coordinate) => {
    if (!isOnWorld(coordinate[0], totalCols)) {
        coordinate[0] = fixCoordinate(coordinate[0], totalCols);
    }
    if (!isOnWorld(coordinate[1], totalRows)) {
        coordinate[1] = fixCoordinate(coordinate[1], totalRows);
    }
    return coordinate;
};
