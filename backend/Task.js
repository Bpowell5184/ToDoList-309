private class Task {
    constructor() {
        this.title = "";
        this.description = "";
        this.creationDate;
        this.dueDate;
        this.points = 5;
        this.priority = 5;
        this.tagsList = new Array();
        this.completionSatus = false;
        this.taskId;
    }
    

    // getter methods

    getTitle() {
        return this.title;
    }
    getDescription() {
        return this.description;
    }
    getdueDate() {
        return this.dueDate;
    }
    getPoints() {
        return this.points;
    }
    getPriority() {
        return this.priority;
    }
    getTagsList() {
        return this.tagsList;
    }
    getCompletionStatus() {
        return this.completionSatus;
    }
    getTaskId() {
        return this.taskId;
    }


    // setter methods

    setTitle(newTitle) {
        this.title = newTitle;
    }
    setDescription(newDescription) {
        this.description =  newDescription;
    }
    setdueDate(newDueDate) {
        this.dueDate = newDueDate;
    }
    setPoints(newPoints) {
        this.points = newPoints;
    }
    setPriority(newPriority) {
        this.priority = newPriority;
    }
    setCompletionStatus(newCompletionStatus) {
        this.completionSatus = newCompletionStatus;
    }
    setTaskId(newTaskId) {
        this.taskId = newTaskId;
    }

    // Tag Editing Methods

    addTag(newTag) {
        this.tagsList.push(newTag);
    }    
    removeTag(targetTagIndex) {
        this.tagsList.delete(targetTagIndex);
    }
    
}

