var enemyStatus = {"toRight": 0, "fallingThenRight": 1, "toLeft": 2, "fallingThenLeft": 3};
Object.freeze(enemyStatus);

function Enemy(pos, status, alive) {
	this.pos = pos;
	this.status = status;
	this.alive = alive;
	this.swapPosition = function(nextPos){
		$(this.pos).toggleClass(enemyC);
		this.pos = nextPos;
		$(this.pos).toggleClass(enemyC);
	};
	this.delete = function(){
		$(this.pos).removeClass(enemyC);
		this.alive = false;
	}
}

var jumpStatus = {"none": 0, "jumping": 1, "floating": 2, "falling": 3};
Object.freeze(jumpStatus);

function Player(pos) {
    this.pos = pos;
    this.jumpCurrentStatus = jumpStatus.none;
    this.swapPosition = function(nextPos) {
    	$(this.pos).toggleClass(playerC);
    	this.pos = nextPos;
    	$(this.pos).toggleClass(playerC);
    };

}
