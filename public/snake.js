const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent); // "Hello world"

var field = [];
var snakes = [];
var size = 40;
var players = 3;
var foods = 5;
var length = 8;
var lengths = new Array(players + 1).join(length).split("").map(_ => Number(_));
var colors = ["red", "green", "blue", "cyan", "magenta", "yellow"];
var intervalId;

(function (d) {
	var grid = d.createElement("div");
	grid.setAttribute("id", "grid");
	for (var i = 0; i < size * size; i++) {
		var cell = d.createElement("div");
		var x = i % size + 1;
		var y = Math.floor(i / size);
		cell.setAttribute("class", "cell");
		cell.setAttribute("id", "cell" + (x - 1) + "x" + y);
		cell.style["grid-column"] = i % size + 1;
		cell.style["grid-size"] = i;
		//cell.innerText = i;
		grid.appendChild(cell);
		field.push({x: x, y: y, t: -1});
	}
	var result = d.createElement("div");
	result.setAttribute("id", "result");
	window.onload = function () {
		d.body.appendChild(grid);
		d.body.appendChild(result);
		for (var i = 0; i < players; i++) {
			snakes.push([]);
			chooseHead(d, i);
		}
		intervalId = setInterval(makeSteps.bind(null, d), 10);
	};
})(document);

function chooseHead(d, i) {
	var headX;
	var headY;
	do {
		headX = ((Math.random() * size) | 0) + 1;
		headY = ((Math.random() * size) | 0);
	} while (!checkIsFree(headX, headY));
	snakes[i].push({x: headX, y: headY});
	snakes[i].forEach(snake => {
		var cell = getCell(d, snake.x, snake.y);
		field.filter(snake => snake.x === headX && snake.y === headY)[0].t = i;
		cell.style["background-color"] = colors[i];
	});
}

function makeSteps(d) {
	addFood();
	for (var i = 0; i < players; i++) {
		try {
			var step = makeStep(_.clone(field), i);
			if (!step || !checkStep(i, step)) {
				clearInterval(intervalId);
				intervalId = null;
				d.getElementById("result").style["background-color"] = colors[i];
				d.getElementById("result").innerText = "Player " + i + " (" + colors[i] + ") lose!\nstep:" +
						(step ? " (" + step.x + ", " + step.y + ")" : " empty");
			} else {
				var type = field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t;
				if (type === -2) {
					lengths[i]++;
				}
				if (snakes[i].length > lengths[i] - 1) {
					var free = snakes[i].splice(0, 1)[0];
					field.filter(cell => cell.x === free.x && cell.y === free.y)[0].t = -1;
					var cell = getCell(d, free.x, free.y);
					cell.style["background-color"] = "white";
				}
				field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t = i;
				snakes[i].push({x: step.x, y: step.y});
			}
		} catch (ex) {
			clearInterval(intervalId);
			d.getElementById("result").style["background-color"] = colors[i];
			d.getElementById("result").innerText = ex.message;
		}
	}
	renderField(d);
}

function makeStep(_field, i) {
	var snake = _.clone(snakes[i]);
	var head = snake.slice(snake.length - 1)[0];
	if (snake.length > lengths[i] - 1) {
		var free = snake.splice(0, 1)[0];
		_field.filter(cell => cell.x === free.x && cell.y === free.y)[0].t = -1;
	}
	var cells = findFreeCells(_field, head);
	var selectedCell = (Math.random() * cells.length) | 0;
	return cells[selectedCell];
}

function checkStep(i, step) {
	var snake = snakes[i];
	var head = snake.slice(snake.length - 1)[0];
	if (Math.abs(step.x - head.x) + Math.abs(step.y - head.y) > 1
			&& Math.abs(step.x - head.x) + Math.abs(step.y - head.y) < size - 1
			|| field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t >= 0) {
		return false;
	}
	return true;
}

function renderField(d) {
	var info = "";
	for (var i = 0; i < players; i++) {
		snakes[i].forEach(snake => {
			var cell = getCell(d, snake.x, snake.y);
			cell.style["background-color"] = colors[i];
		});
		info += ("Player " + i + " (" + colors[i] + ") length = " + lengths[i] + "\n");
	}
	var foods = field.filter(cell => cell.t === -2);
	foods.forEach(food => {
		var cell = getCell(d, food.x, food.y);
		cell.style["background-color"] = "orange";
	});
	if (intervalId) {
		d.getElementById("result").innerText = info;
	}
}

function findFreeCells(_field, head) {
	return _field.filter(_ => (Math.abs(_.x - head.x) + Math.abs(_.y - head.y) === 1
				|| Math.abs(_.x - head.x) === size - 1 && Math.abs(_.y - head.y) === 0
				|| Math.abs(_.x - head.x) === 0 && Math.abs(_.y - head.y) === size - 1)
				&& _.t < 0);
}

function getCell(d, x, y) {
	return d.getElementById("cell" + (x - 1) + "x" + y);
}

function checkIsFree(x, y) {
	return field.filter(cell => (cell.x === x && cell.y === y && cell.t === -1));
}

function addFood() {
	var food = field.filter(cell => cell.t === -2);
	if (food.length < foods) {
		var foodX;
		var foodY;
		do {
			foodX = ((Math.random() * size) | 0) + 1;
			foodY = ((Math.random() * size) | 0);
		} while (!checkIsFree(foodX, foodY));
		field.filter(cell => cell.x === foodX && cell.y === foodY)[0].t = -2;
	}
}
