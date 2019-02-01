/*Game loop*/
var gameLoop;
var spawnTimeout;
var tickTime = 150;
var spawnMin = 2500;
var spawnOffset = 1000;

/*Entities*/
var enemies;
var player;

/*Input*/
var eventRecorded;

/*Score*/
var points = 0;
var jumpPoints = 20;
var lives = 3;

/*Weel known positions*/
var enemySpawnPosition;
var playerSpawnPosition;

/*Manage player input and movement*/
function resolveInputs() {
	switch(eventRecorded) {
		/*RIGHT*/
		case 39:
			var nextPos = getRightPos(player.pos);
			if(nextPos.length > 0 && nextPos.hasClass(walkable)) {
				player.swapPosition(nextPos);
			} else if(nextPos.length > 0) {
				player.jumpCurrentStatus = jumpStatus.falling;
				player.swapPosition(nextPos);
				updateJumpPoints();
			}
		break;
		/*LEFT*/
		case 37:
			var nextPos = getLeftPos(player.pos);
			if(nextPos.length > 0 && nextPos.hasClass(walkable)) {
				player.swapPosition(nextPos)
			} else if(nextPos.length > 0) {
				player.jumpCurrentStatus = jumpStatus.falling;
				player.swapPosition(nextPos);
				updateJumpPoints();
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

/*Generate the map, create the player and the gameloop*/
function setup() {
	generateMap();
	enemySpawnPosition = $("table tr:nth-child(" + (height) + ") td:first-child");
	playerSpawnPosition = $("table tr:last-child").prev().children("td:first-child");

	player = new Player(playerSpawnPosition);
	$(".canvas").scrollTop(player.pos[0].offsetTop - $(".canvas").height() / 2);
	$(player.pos).addClass(backgroundC);
	$(player.pos).addClass(walkable);
	$(player.pos).addClass(playerC);
	enemies = [];
	spawns = [];

	$("span.lives").text(lives);
	$("span.points").text(points);
	$("span.levels").text(floor);

	eventRecorded = undefined;
	gameLoop = setInterval(function() {
		checkCollision();
		if(player.jumpCurrentStatus == jumpStatus.floating || player.jumpCurrentStatus == jumpStatus.none) {
			resolveInputs();
			if(player.jumpCurrentStatus == jumpStatus.floating) {
				updateJumpPoints();
				player.jumpCurrentStatus = jumpStatus.falling;
			}
		} else {
			resolveJumping();
		}
		updateEnemies();
		checkVictory();
	}, tickTime);

	spawnTimeout = setTimeout(function() {
		updateEnemyNumber();
	}, getRandomTime());
}

/*Manage the player jump*/
function resolveJumping() {
	if(player.jumpCurrentStatus == jumpStatus.falling) {
		updateJumpPoints();
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
		updateJumpPoints();
		player.jumpCurrentStatus = jumpStatus.floating;
	}
}

function getRandomTime() {
	return Math.round(Math.random() * spawnOffset) + spawnMin;
}

/*Update enemies movement*/
function updateEnemies() {
	$(enemies).each(function(index, enemy) {
		enemy.update();
	});
}

/*Removes the dead enemies, and spawn new ones in a random time*/
function updateEnemyNumber() {
	enemies = enemies.filter(function(enemy){
		return enemy.alive;
	});

	var newEnemy = new Enemy(enemySpawnPosition, enemyStatus.toRight, true);
	enemies.push(newEnemy);
	$(newEnemy.pos).addClass(enemyC);

	spawnTimeout = setTimeout(function() {
		updateEnemyNumber();
	}, getRandomTime());
}

/*Update score when the player jump over an enemy*/
function updateJumpPoints() {
	if(getBottomPos(player.pos).hasClass(enemyC)) {
		points +=  jumpPoints;
		$("span.points").text(points);
	}
}

/*Check collisions between player and enemies*/
function checkCollision() {
	if($(player.pos).hasClass(enemyC)) {
		lives--;
		//restart game from beginning
		if(lives == 0) {
			points = 0;
			floor = initialFloor;
			width = initialWidth;
			height = initialHeight;
			lives = 3;
			tickTime = 150;
			spawnMin = 2500;
			spawnOffset = 1000;
			stairsForFloor = Math.round(initialWidth / 10);
		}
		clearInterval(gameLoop);
		setTimeout(function(){
			cleanUp();
			setup();
		}, 2000);
	}
}

/*Checks whenever a player reach the top, then restart the game*/
function checkVictory() {
	if($(enemySpawnPosition).hasClass(playerC)) {
		/*
		if(window.sessionStorage.donkeyScore) {
			window.sessionStorage.donkeyScore += points;
		} else {
			window.sessionStorage.donkeyScore = points;
		}
		*/
		//Update map size
		floor+=2;
		width++;
		stairsForFloor = Math.round(width / 10);
		spawnMin -= 10;
		spawnOffset -= 10;
		cleanUp();
		setTimeout(function(){
			setup();
		}, 1000);
	}
}

/*Removes all dynamic match elements*/
function cleanUp() {
	enemies = [];
	$("table").empty();
	eventRecorded = undefined;
	clearInterval(gameLoop);
	clearTimeout(spawnTimeout);
	spawns = [];
}

$(document).ready(function() {
	document.addEventListener('keydown', function(event){
		eventRecorded = event.keyCode;
		event.preventDefault();
	});

	setup();
});
