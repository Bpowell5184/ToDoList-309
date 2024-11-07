const Task = require("./Task");

test('Does The Task Constructor Work?', () => {
    const result = new Task();

    expect(result.title).toMatch("untitled");
    expect(result.title).not.toMatch("THIS IS THE WRONG TITLE");
    expect(result.description).toMatch("description");
    expect(result.description).not.toMatch("THIS IS THE WRONG DESCRIPTION");
    expect(result.points).toBe(5);
    expect(result.points).not.toBe(100);
    expect(result.priority).toBe(5);
    expect(result.priority).not.toBe(33);
    expect(result.tagsList).toEqual([]);
    expect(result.tagsList).not.toEqual(["Some Object"]);
    expect(result.completionSatus).toBeFalsy();
    expect(result.completionSatus).not.toBeTruthy();
})