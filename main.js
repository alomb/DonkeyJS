var tickTime = 150;
var spawnMin = 2500;
var spawnOffset = 1000;

var enemies = [];
var player;

var eventRecorded;

function resolveInputs() {
	switch(eventRecorded) {
		/*RIGHT*/
		case 39:
			var nextPos = getRightPos(player.pos);
			if(nextPos.length > 0 && nextPos.hasClass(walkable)) {
				player.swapPosition(nextPos);
			} else if(nextPos.length > 0) {
				player.jumpCurrentStatus = jumpStatus.falling;
				player.swapPosition(nextPos)
			}
		break;
		/*LEFT*/
		case 37:
			var nextPos = getLeftPos(player.pos);
			if(nextPos.length > 0 && nextPos.hasClass(walkable)) {
				player.swapPosition(nextPos)
			} else if(nextPos.length > 0) {
				player.jumpCurrentStatus = jumpStatus.falling;
				player.swapPosition(nextPos)
			}
		break;
		/*UP*/
		case 38:
			var nextPos = getTopPos(player.pos);
			if($(nextPos).hasClass(walkable)) {
				player.swapPosition(nextPos)
			} else if(player.jumpCurrentStatus == jumpStatus.none) {
				player.jumpCurrentStatus = jumpStatus.jumping;
				player.swapPosition(nextPos)
			}
		break;
		/*DOWN*/
		case 40:
			var nextPos = getBottomPos(player.pos);
			if($(nextPos).hasClass(walkable)) {
				player.swapPosition(nextPos)
			}
		break;
	}

	eventRecorded = undefined;
}

function resolveJumping() {
	if(player.jumpCurrentStatus == jumpStatus.falling) {
		eventRecorded = undefined;
		if($(player.pos).hasClass(walkable)) {
			player.jumpCurrentStatus = jumpStatus.none;
		} else {
			var nextPos = $(player.pos).parent("tr").next("tr").children('td:nth-child(' + ($(player.pos).prevAll("td").length + 1) + ')');
			player.swapPosition(nextPos)
			if($(player.pos).hasClass(walkable)) {
				player.jumpCurrentStatus = jumpStatus.none;
			}
		}

	} else if(player.jumpCurrentStatus == jumpStatus.jumping) {
		player.jumpCurrentStatus = jumpStatus.floating;
	}
}

function getRandomTime() {
	return Math.round(Math.random() * spawnOffset) + spawnMin;
}

function updateEnemies() {
	$(enemies).each(function(index, enemy) {
		enemy.update();
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

		player = new Player($("table tr:last-child").prev().children("td:first-child"));
		$(player.pos).addClass(backgroundC);
		$(player.pos).addClass(walkable);
		$(player.pos).addClass(playerC);

		document.addEventListener('keydown', function(event){
			eventRecorded = event.keyCode;
		});

		setInterval(function() {
			if(player.jumpCurrentStatus == jumpStatus.floating || player.jumpCurrentStatus == jumpStatus.none) {
				resolveInputs();
				if(player.jumpCurrentStatus == jumpStatus.floating) {
					player.jumpCurrentStatus = jumpStatus.falling;
				}
			} else {
				resolveJumping();
			}
			updateEnemies();
		}, tickTime);

		setTimeout(function() {
			updateEnemyNumber();
		}, getRandomTime());
});
