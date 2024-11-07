const User = require('./User');
class Data{
    constructor(){
        this.userList = [];
    }
    getuserList(){
        return this.userList;
    }
    addUser(username, password){
         const user = new User(username, password);
         this.userList.push(user);
    }
}
