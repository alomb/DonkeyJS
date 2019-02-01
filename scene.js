/*Environment*/
var walkable = "walkable";
/*Style*/
var playerC = "player";
var backgroundC = "background";
var stairC = "stair";
var floorC = "floor";
var enemyC = "enemy";

var initialFloor = 6;
var initialWidth = 20;
var initialHeight = 3;
var floor = initialFloor;
var width = initialWidth;
var height = initialHeight;
var stairsForFloor = Math.round(initialWidth / 10);


/*
Create some random position to put the stair
stairs: reference to other floor stairs
*/
function generateRandomPositionStair(stairs){
	var res = [];
	var tmp = [];
	for(var i = 1; i < width - 1; i++) {
		// To avoid merging of stairs from different floor
		if(!stairs.includes(i - 1) && !stairs.includes(i) && !stairs.includes(i + 1)) {
			tmp.push(i);
		}
	}
	for(var i = 0; i < stairsForFloor; i++) {
		var val = Math.round(Math.random() * (tmp.length - 1));
		res[i] = tmp[val];
		// normally slice three values to avoid next stairs, or two in edge
		if(tmp.length > 2 && val != 0 && val != tmp.length - 1) {
			tmp.splice(val - 1, 3);
		} else if(tmp.length > 1 && val == tmp.length - 1) {
			tmp.splice(val - 1, 2);
		} else if(tmp.length > 1 && val == 0) {
			tmp.splice(val, 2);
		} else {
			tmp.splice(val, 1);
		}
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
		var stairs = [];
		for(var j = 0; j < height - 1; j++) {
				$("table").append(generateAir([]));
		}
		$("table").append(generateWalkable([], holeRight));
		for(var i = 0; i < floor - 1; i++) {
				stairs = generateRandomPositionStair(stairs);
				$("table").append(generateFloor(stairs, holeRight));
				for(var j = 0; j < height - 1; j++) {
						$("table").append(generateAir(stairs));
				}
				holeRight = !holeRight;
				$("table").append(generateWalkable(stairs, holeRight));
		}
		$("table").append(generateFloor([]));
}
