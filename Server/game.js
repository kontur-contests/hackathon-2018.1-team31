exports.game = function () {
    
    class Game {
        constructor(playerIdOne, playerIdTwo, status) {
          this.playerIdOne = playerIdOne;
          this.playerIdTwo = playerIdTwo;
          this.status = status;
        }
        
        get playerIdOne() {
            return this.playerIdOne;
        }

        get playerIdTwo() {
            return this.playerIdTwo;
        }
        get posOne() {

        }
        get posTwo() {
            
        }
    }
};