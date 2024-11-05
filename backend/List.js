class List {
    constructor() {
        this.taskList = new Array();
        this.LID;
        this.UID;
    }

    getTaskList() {
        return this.taskList;
    }
    getLID() {
        return this.LID;
    }
    getUID() {
        return this.UID;
    }

    addTask(newTask) {
        this.taskList.push(newTask)
    }
    removeTask(targetTaskId) {
        for (let i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getTaskId() == targetTaskId) {
                this.taskList.delete(i);
                return true;
            }
        }
        return false;
    }
    completeTask(targetTaskId) {
        for (let i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getTaskId() == targetTaskId) {
                this.taskList[i].setCompletionStatus(true);
                return true;
            }
        }
        return false;
    }

    filterByPriority(targetPriority) {
        let sublist = new Array();
        for (let i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getPriority() == targetPriority) {
                sublist.push(this.taskList[i]);
            }
        }
        return sublist;
    }
    filterByPointValue(targetPointValue) {
        let sublist = new Array();
        for (let i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getPointValue() == targetPointValue) {
                sublist.push(this.taskList[i]);
            }
        }
        return sublist;
    }
    filterByTag(targetTag) {
        let sublist = new Array();
        for (let i = 0; i < this.taskList.length; i++) {
            let tagList = this.taskList[i].getTagList()
            for (let j = 0; j < tagList.length; j++) {
                if (tagList[j].getTag() == targetTag){
                    sublist.push(this.taskList[i]);
                    break;
                }
            }
        }
        return sublist;
    }

}