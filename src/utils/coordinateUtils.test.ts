import { getCoordinateWithIndex, getIndexWithCoordinate, getValueWithCoordinate } from "./coordinateUtil";

const totalColumns = 3;
const totalRows = 3;
const singleDimArr = [];


describe('coordinateUtils => ', () => {
  
  beforeEach(() => {
      for (let i = 0; i < totalColumns * totalColumns; i++) {
        singleDimArr.push(i);
      }
  })

  test('(0,0) should have index 0', () => {
    const index = getIndexWithCoordinate(totalColumns, totalRows, 0, 0);
    expect(index).toBe(0);
  });

  test('(2,2) should have index 8', () => {
    const index = getIndexWithCoordinate(totalColumns, totalRows, 2, 2);
    expect(index).toBe(8);
  });
  test('(0,1) should have index 3', () => {
    const index = getIndexWithCoordinate(totalColumns, totalRows, 0, 1);
    expect(index).toBe(3);
  });
  test('(1,0) should have index 1', () => {
    const index = getIndexWithCoordinate(totalColumns, totalRows, 1, 0);
    expect(index).toBe(1);
  });
  test('(3,3) should return undefined', () => {
    const index = getIndexWithCoordinate(totalColumns, totalRows, 3, 3);
    expect(index).toBeUndefined();
  });
  test('(0,3) should return undefined', () => {
    const index = getIndexWithCoordinate(totalColumns, totalRows, 0, 3);
    expect(index).toBeUndefined();
  });
  test('(3,0) should return undefined', () => {
    const index = getIndexWithCoordinate(totalColumns, totalRows, 3, 0);
    expect(index).toBeUndefined();
  });

  test('8 should return (2,2)', () => {
    const coord = getCoordinateWithIndex(3, 8);
    expect(coord[0]).toBe(2);
    expect(coord[1]).toBe(2);
  });

  test('3 should return (0,1)', () => {
    const coord = getCoordinateWithIndex(3, 3);
    expect(coord[0]).toBe(0);
    expect(coord[1]).toBe(1);
  });
  test('0 should return (0,0)', () => {
    const coord = getCoordinateWithIndex(3, 0);
    expect(coord[0]).toBe(0);
    expect(coord[1]).toBe(0);
  });
  test('1 should return (1,0)', () => {
    const coord = getCoordinateWithIndex(3, 1);
    expect(coord[0]).toBe(1);
    expect(coord[1]).toBe(0);
  });

  test('(0,0) should return 0', () => {
    const cell = getValueWithCoordinate(singleDimArr, totalColumns, 0, 0)
    expect(cell).toBe(0);
  });


});
