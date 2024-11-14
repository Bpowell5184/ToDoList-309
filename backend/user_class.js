class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.highScore = 0;
        this.UID = null;
        this.LID = null;
        this.totalTasks = 0;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

    getUID() {
        return this.UID;
    }

    getLID() {
        return this.LID;
    }

    getHighScore() {
        return this.highScore;
    }

    setUID(uid) {
        this.UID = uid;
    }

    setLID(lid) {
        this.LID = lid;
    }

    login(tryUser, tryPass) {
        return tryUser === this.username && tryPass === this.password;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }

    setPassword(newPassword) {
        this.password = newPassword;
    }

    highScoreCheck(dayScore) {
        if (dayScore > this.highScore) {
            this.highScore = dayScore;
        }
    }
}

