import Task from "./task_class.js"

test('Does The Task Constructor & Getters Work?', () => {
    const result = new Task();

    expect(result.getTitle()).toMatch("untitled");
    expect(result.getTitle()).not.toMatch("THIS IS THE WRONG TITLE");
    expect(result.getDescription()).toMatch("description");
    expect(result.getDescription()).not.toMatch("THIS IS THE WRONG DESCRIPTION");
    expect(result.getPoints()).toBe(5);
    expect(result.getPoints()).not.toBe(100);
    expect(result.getPriority()).toBe(5);
    expect(result.getPriority()).not.toBe(33);
    expect(result.getTagsList()).toEqual([]);
    expect(result.getTagsList()).not.toEqual(["Some Object"]);
    expect(result.getCompletionStatus()).toBeFalsy();
    expect(result.getCompletionStatus()).not.toBeTruthy();
})

test('Does setTitle Work?', () => {
    const result = new Task();
    
    result.setTitle("Eat a Large Mango.");
    expect(result.getTitle()).toMatch("Eat a Large Mango.");

    result.setTitle("Eat a Small Pineapple.");
    expect(result.getTitle()).toMatch("Eat a Small Pineapple.");

    result.setTitle("");
    expect(result.getTitle()).toMatch("");
    expect(result.getTitle()).not.toMatch("Eat a Small Pineapple.");
})

test('Does setDescription Work?', () => {
    const result = new Task();
    
    result.setDescription("Eat a Large Mango.");
    expect(result.getDescription()).toMatch("Eat a Large Mango.");

    result.setDescription("Eat a Small Pineapple.");
    expect(result.getDescription()).toMatch("Eat a Small Pineapple.");

    result.setDescription("");
    expect(result.getDescription()).toMatch("");
    expect(result.getDescription()).not.toMatch("Eat a Small Pineapple.");
})

test('Does setPoints Work?', () => {
    const result = new Task();
    
    result.setPoints(0);
    expect(result.getPoints()).toBe(0);

    result.setPoints(10);
    expect(result.getPoints()).toBe(10);

    result.setPoints(5);
    expect(result.getPoints()).toBe(5);
    expect(result.getPoints()).not.toBe(3);
})

test('Does setPriority Work?', () => {
    const result = new Task();
    
    result.setPriority(0);
    expect(result.getPriority()).toBe(0);

    result.setPriority(10);
    expect(result.getPriority()).toBe(10);

    result.setPriority(5);
    expect(result.getPriority()).toBe(5);
    expect(result.getPriority()).not.toBe(3);
})
