import { Coordinate } from "../types";

const isOnWorld = (val: number, max: number) => (val < max && val >= 0);

const fixCoordinate = (value: number, maxValue: number) => {
    
    if (value < 0) {
        value = (maxValue -1) + value;

    }
    else if (value >= (maxValue)) {
        value = Math.floor(value % maxValue);
    }

    return value;
}

export const getValueWithCoordinate = <A>(oneDimensionalArr: A[], totalColumns: number,  x: number, y: number): A | undefined => {
    const totalRows = Math.ceil(oneDimensionalArr.length / totalColumns);
    const index =  getIndexWithCoordinate(totalColumns, totalRows, x, y);
    return index != undefined && oneDimensionalArr.length > index ? oneDimensionalArr[index] : undefined;
}

export const getIndexWithCoordinate = (totalColumns: number, totalRows: number, x: number, y: number): number => {
    //console.log(`${totalColumns}, ${totalRows}, (${x}, ${y})`)
    let index = totalColumns > y && totalRows > x ? Math.floor(totalColumns * y) + x : undefined;
    if (index === undefined) {
        throw Error(`Trying to access illegal index at (${x},${y})`)
    }
    return index;
}

//Does not ensure that index exists in the array.
export const getCoordinateWithIndex = (totalColumns: number, index: number): Coordinate => {
    const x = Math.floor(index % totalColumns);
    const y = Math.floor(index / totalColumns);

    return [x, y];
}


//Changes the original value.
export const wrapCoordinateToWorld = (totalCols: number, totalRows: number, coordinate: Coordinate):Coordinate => {
    if (!isOnWorld(coordinate[0], totalCols)) {
        coordinate[0] = fixCoordinate(coordinate[0], totalCols);

    }
    if (!isOnWorld(coordinate[1], totalRows)) {
        coordinate[1] = fixCoordinate(coordinate[1], totalRows);
    }  

    return coordinate;
}
