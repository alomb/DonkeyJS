var floor = 6;
var width = 17;
var height = 2;
var stairsForFloor = 3;

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

function generateFloor(stair, holeRight) {
		var res = '<tr>';
		var max = width;
		var i = 0;
		if(holeRight === false){
				res+='<td class="air">0</td>';
				i++;
		} else if(holeRight === true) {
				max--;
		}
		for(i; i < max; i++) {
				if(!stair.includes(i)) {
					res+='<td class="floor">0</td>';
				} else {
					res+='<td class="stair">0</td>';
				}
		}
		if(holeRight === true) {
				res+='<td class="air">0</td>';
		}
		return res += '</tr>';
}

function generateWalkable(stair, holeRight) {
		var res = '<tr>';
		var max = width;
		var i = 0;
		if(holeRight === false) {
				res+='<td class="air">0</td>';
				i++;
		} else if(holeRight === true) {
				max--;
		}
		for(i; i < max; i++) {
				if(!stair.includes(i)) {
					res+='<td class="walkable">0</td>';
				} else {
					res+='<td class="stair">0</td>';
				}
		}
		if(holeRight === true) {
				res+='<td class="air">0</td>';
		}
		return res += '</tr>';
}

function generateAir(stair) {
		var res = '<tr>'
		var max = width;
		var i = 0;
		for(i; i < max; i++) {
				if(!stair.includes(i)) {
					res+='<td class="air">0</td>';
				} else {
					res+='<td class="stair">0</td>';
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
				var stair = generateRandomPositionStair();
				$("table").append(generateFloor(stair, holeRight));
				for(var j = 0; j < height - 1; j++) {
						$("table").append(generateAir(stair));
				}
				holeRight = !holeRight;
				$("table").append(generateWalkable(stair, holeRight));
		}
		$("table").append(generateFloor([]));
}

$(document).ready(function() {
		$("div.matchResult").hide();
		generateMap();
});
