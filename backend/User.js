private class User{
    constructor(Username, Password){
        this.username = Username;
        this.password = Password;
        this.highScore = 0;
        this.UID;
        this.LID;
    }
    getUsername(){
       return this.username;
    }
    getPassword(){
        return this.password;
    }
    getUID(){
        return this.UID;
    }
    getLID(){
        return this.LID;
    }
    gethighScore(){
        return this.highScore;
    }
    login(tryuser, trypass){
        if(tryuser.equals(this.username)){
            if(trypass.equals(this.username)){
                return true;
            }
        }
        return false;
    }
    setUsername(newUsername){
       this.username = newUsername;
    }
    setPassword(newPassword){
        this.password = newPassword;
    }
    highScorecheck(dayscore){
        if(dayscore > this.highScore){
            this.highScore = dayscore;
        }
    }
}
module.exports = User;
