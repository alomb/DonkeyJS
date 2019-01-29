var enemyStatus = {"toRight": 0, "fallingThenRight": 1, "toLeft": 2, "fallingThenLeft": 3};
Object.freeze(enemyStatus);

function getLeftPos(pos) {
    return $(pos).prev("td");
}

function getRightPos(pos) {
    return $(pos).next("td")
}

function getTopPos(pos) {
    return $(pos).parent("tr").prev("tr").children('td:nth-child(' + ($(pos).prevAll("td").length + 1) + ')');
}

function getBottomPos(pos) {
    return $(pos).parent("tr").next("tr").children('td:nth-child(' + ($(pos).prevAll("td").length + 1) + ')');
}

function Enemy(pos, status, alive) {
	this.pos = pos;
	this.status = status;
	this.alive = alive;
	this.swapPosition = function(nextPos){
		$(this.pos).removeClass(enemyC);
		this.pos = nextPos;
		$(this.pos).addClass(enemyC);
	};
	this.delete = function(){
		$(this.pos).removeClass(enemyC);
		this.alive = false;
	};
    this.update = function() {
        if(getTopPos(this.pos).hasClass(walkable) && getBottomPos(this.pos).hasClass(walkable)) {
            this.swapPosition(getBottomPos(this.pos));
            if(this.status == enemyStatus.fallingThenLeft && getRightPos(this.pos).hasClass(walkable) && getLeftPos(this.pos).hasClass(walkable)) {
                this.status = enemyStatus.toLeft;
            } else if(this.status == enemyStatus.fallingThenRight && getRightPos(this.pos).hasClass(walkable) && getLeftPos(this.pos).hasClass(walkable)) {
                this.status = enemyStatus.toRight;
            }
        } else {
            switch (this.status) {
    			case enemyStatus.toRight:
    				var nextPos = getRightPos(this.pos);
                    if(nextPos.length == 0) {
                        this.delete();
                        break;
                    } else if(getBottomPos(this.pos).hasClass(walkable) && Math.random() <= 0.2) {
                        nextPos = getBottomPos(this.pos);
                        this.status = enemyStatus.fallingThenLeft;
                        break;
                    } else if(!nextPos.hasClass(walkable)) {
                        this.status = enemyStatus.fallingThenLeft;
                    }
                    this.swapPosition(nextPos);
    				break;
    			case enemyStatus.fallingThenLeft:
    				var nextPos = getBottomPos(this.pos);
    				this.swapPosition(nextPos);
    				if(nextPos.hasClass(walkable)) {
    					this.status = enemyStatus.toLeft;
    				}
    				break;
    			case enemyStatus.toLeft:
    				var nextPos = getLeftPos(this.pos);
                    if(nextPos.length == 0) {
                        this.delete();
                        break;
                    } else if(getBottomPos(this.pos).hasClass(walkable) && Math.random() <= 0.2) {
                        nextPos = getBottomPos(this.pos);
                        this.status = enemyStatus.fallingThenRight;
                        break;
                    } else if(!nextPos.hasClass(walkable)) {
                        this.status = enemyStatus.fallingThenRight;
                    }
                    this.swapPosition(nextPos);
    				break;
    			case enemyStatus.fallingThenRight:
    				var nextPos = getBottomPos(this.pos);
    				this.swapPosition(nextPos);
    				if(nextPos.hasClass(walkable)) {
    					this.status = enemyStatus.toRight;
    				}
    				break;
    			default:
    		}
        }
    };
}

var jumpStatus = {"none": 0, "jumping": 1, "floating": 2, "falling": 3};
Object.freeze(jumpStatus);

function Player(pos) {
    this.pos = pos;
    this.jumpCurrentStatus = jumpStatus.none;
    this.swapPosition = function(nextPos) {
    	$(this.pos).removeClass(playerC);
    	this.pos = nextPos;
    	$(this.pos).addClass(playerC);
		$(".canvas").scrollTop(this.pos[0].offsetTop - $(".canvas").height() / 2);		
	};

}
