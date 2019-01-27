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

function resolveInputs() {
	console.log(eventRecorded);
	switch(eventRecorded) {
		/*RIGHT*/
		case 39:
			if($(playerPos).next("td").hasClass(walkable) && $(playerPos).next("td")) {
				$(playerPos).toggleClass(playerC);
				playerPos = $(playerPos).next("td");
				$(playerPos).toggleClass(playerC);
			}
		break;
		/*LEFT*/
		case 37:
			if($(playerPos).prev("td").hasClass(walkable) && $(playerPos).prev("td")) {
				$(playerPos).toggleClass(playerC);
				playerPos = $(playerPos).prev("td");
				$(playerPos).toggleClass(playerC);
			}
		break;
		/*UP*/
		case 38:
			var nextPos = $(playerPos).parent("tr").prev("tr").children('td:nth-child(' + ($(playerPos).prevAll("td").length + 1) + ')');
			if($(nextPos).hasClass(walkable)) {
				$(playerPos).toggleClass(playerC);
				playerPos = nextPos;
				$(playerPos).toggleClass(playerC);
			}
		break;
		/*DOWN*/
		case 40:
			var nextPos = $(playerPos).parent("tr").next("tr").children('td:nth-child(' + ($(playerPos).prevAll("td").length + 1) + ')');
			if($(nextPos).hasClass(walkable)) {
				$(playerPos).toggleClass(playerC);
				playerPos = nextPos;
				$(playerPos).toggleClass(playerC);
			}
		break;
	}
	eventRecorded = undefined;
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

		setInterval(function(){
			resolveInputs();
		}, 100);
});
