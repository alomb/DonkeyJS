/*Environment*/
var walkable = "walkable";
/*Style*/
var playerC = "player";
var backgroundC = "background";
var stairC = "stair";
var floorC = "floor";
var enemyC = "enemy";

var floor = 6;
var width = 25;
var height = 3;
var stairsForFloor = 2;

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
