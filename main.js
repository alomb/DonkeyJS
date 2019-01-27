var floor = 6;
var width = 17;
var height = 2;
var stairsForFloor = 3;

/*Environment*/
var walkable = "walkable";
/*Style*/
var playerC = "player";
var backgroundC = "background";
var stairC = "stair";
var floorC = "floor";
var enemyC = "enemy";

enemies = [];

var enemyStatus = {"toRight": 0, "fallingThenRight": 1, "toLeft": 2, "fallingThenLeft": 3};

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

function generateRandomPositionStair(){
		var res = [];
		var tmp = [];
		for(var i = 1; i < width - 1; i++) {
			tmp[i] = i;
		}
		for(var i = 0; i < stairsForFloor; i++) {
			var val = Math.round(Math.random() * (width - 1 - i));
			res[i] = tmp[val];
			tmp.slice(val, 1);
		}
		return res;
}

function generateFloor(stairs, holeRight) {
		var res = '<tr>';
		var max = width;
		var i = 0;
		if(holeRight === false){
				res+='<td class="' + backgroundC + '">0</td>';
				i++;
		} else if(holeRight === true) {
				max--;
		}
		for(i; i < max; i++) {
				if(!stairs.includes(i)) {
					res+='<td class="' + floorC + '">0</td>';
				} else {
					res+='<td class="' + stairC + ' ' + walkable + '">0</td>';
				}
		}
		if(holeRight === true) {
				res+='<td class="' + backgroundC + '">0</td>';
		}
		return res += '</tr>';
}

function generateWalkable(stairs, holeRight) {
		var res = '<tr>';
		var max = width;
		var i = 0;
		if(holeRight === false) {
				res+='<td class="' + backgroundC + '">0</td>';
				i++;
		} else if(holeRight === true) {
				max--;
		}
		for(i; i < max; i++) {
				if(!stairs.includes(i)) {
					res+='<td class="'+ backgroundC + ' ' + walkable + '">0</td>';
				} else {
					res+='<td class="' + stairC + ' ' + walkable + '">0</td>';
				}
		}
		if(holeRight === true) {
				res+='<td class="'+ backgroundC + '">0</td>';
		}
		return res += '</tr>';
}

function generateAir(stairs) {
		var res = '<tr>';
		var max = width;
		var i = 0;
		for(i; i < max; i++) {
				if(!stairs.includes(i)) {
					res+='<td class="'+ backgroundC + '">0</td>';
				} else {
					res+='<td class="' + stairC + ' ' + walkable + '">0</td>';
				}
		}
		return res += '</tr>';
}

function generateMap() {
		var holeRight = true;
		for(var j = 0; j < height - 1; j++) {
				$("table").append(generateAir([]));
		}
		$("table").append(generateWalkable([], holeRight));
		for(var i = 0; i < floor - 1; i++) {
				var stairs = generateRandomPositionStair();
				$("table").append(generateFloor(stairs, holeRight));
				for(var j = 0; j < height - 1; j++) {
						$("table").append(generateAir(stairs));
				}
				holeRight = !holeRight;
				$("table").append(generateWalkable(stairs, holeRight));
		}
		$("table").append(generateFloor([]));
}

var eventRecorded;
var playerPos;
var jumpStatus = {"none": 0, "jumping": 1, "floating": 2, "falling": 3};
Object.freeze(jumpStatus);
var jumpCurrentStatus = jumpStatus.none;

function swapPosition(nextPos) {
	$(playerPos).toggleClass(playerC);
	playerPos = nextPos;
	$(playerPos).toggleClass(playerC);
}

function resolveInputs() {
	switch(eventRecorded) {
		/*RIGHT*/
		case 39:
			var nextPos = $(playerPos).next("td");
			if(nextPos.length > 0 && nextPos.hasClass(walkable)) {
				swapPosition(nextPos);
			} else if(nextPos.length > 0) {
				jumpCurrentStatus = jumpStatus.falling;
				swapPosition(nextPos)
			}
		break;
		/*LEFT*/
		case 37:
			var nextPos = $(playerPos).prev("td");
			if(nextPos.length > 0 && nextPos.hasClass(walkable)) {
				swapPosition(nextPos)
			} else if(nextPos.length > 0) {
				jumpCurrentStatus = jumpStatus.falling;
				swapPosition(nextPos)
			}
		break;
		/*UP*/
		case 38:
			var nextPos = $(playerPos).parent("tr").prev("tr").children('td:nth-child(' + ($(playerPos).prevAll("td").length + 1) + ')');
			if($(nextPos).hasClass(walkable)) {
				swapPosition(nextPos)
			} else if(jumpCurrentStatus == jumpStatus.none) {
				jumpCurrentStatus = jumpStatus.jumping;
				swapPosition(nextPos)
			}
		break;
		/*DOWN*/
		case 40:
			var nextPos = $(playerPos).parent("tr").next("tr").children('td:nth-child(' + ($(playerPos).prevAll("td").length + 1) + ')');
			if($(nextPos).hasClass(walkable)) {
				swapPosition(nextPos)
			}
		break;
	}

	eventRecorded = undefined;
}

function resolveJumping() {
	if(jumpCurrentStatus == jumpStatus.falling) {
		eventRecorded = undefined;
		if($(playerPos).hasClass(walkable)) {
			jumpCurrentStatus = jumpStatus.none;
		} else {
			var nextPos = $(playerPos).parent("tr").next("tr").children('td:nth-child(' + ($(playerPos).prevAll("td").length + 1) + ')');
			swapPosition(nextPos)
			if($(playerPos).hasClass(walkable)) {
				jumpCurrentStatus = jumpStatus.none;
			}
		}

	} else if(jumpCurrentStatus == jumpStatus.jumping) {
		jumpCurrentStatus = jumpStatus.floating;
	}
}

function getRandomTime() {
	return Math.round(Math.random() * 2000) + 4500;
}

function updateEnemies() {
	$(enemies).each(function(index, enemy) {
		switch (enemy.status) {
			case enemyStatus.toRight:
				var nextPos = $(enemy.pos).next("td");
				if(nextPos.length == 0) {
					enemy.delete();
				} else {
					enemy.swapPosition(nextPos);
					if(!nextPos.hasClass(walkable)) {
						enemy.status = enemyStatus.fallingThenLeft;
					}
				}
				break;
			case enemyStatus.fallingThenLeft:
				var nextPos = $(enemy.pos).parent("tr").next("tr").children('td:nth-child(' + ($(enemy.pos).prevAll("td").length + 1) + ')');
				enemy.swapPosition(nextPos);
				if(nextPos.hasClass(walkable)) {
					enemy.status = enemyStatus.toLeft;
				}
				break;
			case enemyStatus.toLeft:
				var nextPos = $(enemy.pos).prev("td");
				if(nextPos.length == 0) {
					enemy.delete();
				} else {
					enemy.swapPosition(nextPos);
					if(!nextPos.hasClass(walkable)) {
						enemy.status = enemyStatus.fallingThenRight;
					}
				}
				break;
			case enemyStatus.fallingThenRight:
				var nextPos = $(enemy.pos).parent("tr").next("tr").children('td:nth-child(' + ($(enemy.pos).prevAll("td").length + 1) + ')');
				enemy.swapPosition(nextPos);
				if(nextPos.hasClass(walkable)) {
					enemy.status = enemyStatus.toRight;
				}
				break;
			default:
		}
	});
}

function filterAliveEnemies(enemy) {
	return enemy.alive;
}

function updateEnemyNumber() {
	enemies = enemies.filter(filterAliveEnemies);

	var newEnemy = new Enemy($("table tr:nth-child(" + height + ") td:first-child"), enemyStatus.toRight, true);
	enemies.push(newEnemy);
	$(newEnemy.pos).addClass(enemyC);

	setTimeout(function() {
		updateEnemyNumber();
	}, getRandomTime());
}


$(document).ready(function() {
		$("div.matchResult").hide();
		generateMap();

		playerPos = $("table tr:last-child").prev().children("td:first-child");
		$(playerPos).addClass(backgroundC);
		$(playerPos).addClass(walkable);
		$(playerPos).addClass(playerC);

		document.addEventListener('keydown', function(event){
			eventRecorded = event.keyCode;
		});

		setInterval(function() {
			if(jumpCurrentStatus == jumpStatus.floating || jumpCurrentStatus == jumpStatus.none) {
				resolveInputs();
				if(jumpCurrentStatus == jumpStatus.floating) {
					jumpCurrentStatus = jumpStatus.falling;
				}
			} else {
				resolveJumping();
			}
			updateEnemies();
		}, 150);

		setTimeout(function() {
			updateEnemyNumber();
		}, getRandomTime());
});
