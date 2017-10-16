class Server {

	constructor(players) {
		this.field = [];
		this.snakes = [];
		this.size = 40;
		this.players = players;
		this.foods = 5;
		this.speed = 10;
		this.length = 8;
		this.lengths = new Array(this.players.length + 1).join(this.length).split("").map(_ => Number(_));
		this.colors = ["red", "green", "blue", "cyan", "magenta", "yellow"];
		this.intervalId;
	}

	start(d) {
		for (let i = 0; i < this.players.length; i++) {
			this.snakes.push([]);
			this.chooseHead(d, i);
		}
		this.intervalId = setInterval(this.makeSteps.bind(this, d), this.speed);
	}

	chooseHead(d, i) {
		let headX;
		let headY;
		do {
			headX = ((Math.random() * this.size) | 0) + 1;
			headY = ((Math.random() * this.size) | 0);
		} while (!this.checkIsFree(headX, headY));
		this.snakes[i].push({x: headX, y: headY});
		this.snakes[i].forEach(snake => {
			let cell = this.getCell(d, snake.x, snake.y);
			this.field.filter(snake => snake.x === headX && snake.y === headY)[0].t = i;
			cell.style["background"] = "none";
			cell.style["background-color"] = this.colors[i];
		});
	}

	makeSteps(d) {
		this.addFood();
		for (let i = 0; i < this.players.length; i++) {
			try {
				let step = this.players[i].makeStep(_.clone(this.field), _.cloneDeep(this.snakes));
				if (!step || !this.checkStep(i, step)) {
					clearInterval(this.intervalId);
					this.intervalId = null;
					d.getElementById("result").style["background-color"] = this.colors[i];
					d.getElementById("result").innerText = "Player " + i + " (" + this.colors[i] + ") lose!\nstep:" +
							(step ? " (" + step.x + ", " + step.y + ")" : " empty");
				} else {
					let type = this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t;
					if (type === -2) {
						this.lengths[i]++;
					}
					if (this.snakes[i].length > this.lengths[i] - 1) {
						let free = this.snakes[i].splice(0, 1)[0];
						this.field.filter(cell => cell.x === free.x && cell.y === free.y)[0].t = -1;
						let cell = this.getCell(d, free.x, free.y);
						cell.style["background"] = "none";
						cell.style["background-color"] = "white";
					}
					this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t = i;
					this.snakes[i].push({x: step.x, y: step.y});
				}
			} catch (ex) {
				console.error(ex);
				clearInterval(this.intervalId);
				this.intervalId = null;
				d.getElementById("result").style["background-color"] = this.colors[i];
				d.getElementById("result").innerText = ex.message;
			}
		}
		this.renderField(d);
	}

	makeStep(_field, i) {
		let snake = _.clone(this.snakes[i]);
		let head = snake.slice(snake.length - 1)[0];
		if (snake.length > this.lengths[i] - 1) {
			let free = snake.splice(0, 1)[0];
			_field.filter(cell => cell.x === free.x && cell.y === free.y)[0].t = -1;
		}
		let cells = this.findFreeCells(_field, head);
		let selectedCell = (Math.random() * cells.length) | 0;
		return cells[selectedCell];
	}

	checkStep(i, step) {
		let snake = this.snakes[i];
		let head = snake.slice(snake.length - 1)[0];
		if (Math.abs(step.x - head.x) + Math.abs(step.y - head.y) > 1
				&& Math.abs(step.x - head.x) + Math.abs(step.y - head.y) < this.size - 1
				|| this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t >= 0) {
			return false;
		}
		return true;
	}

	renderField(d) {
		let info = "";
		let foods = this.field.filter(cell => cell.t === -2);
		foods.forEach(food => {
			let cell = this.getCell(d, food.x, food.y);
			cell.style["background"] = "url(./apple.png) no-repeat";
			cell.style["background-size"] = "100%";
		});
		for (let i = 0; i < this.players.length; i++) {
			this.snakes[i].forEach((snake, j) => {
				let cell = this.getCell(d, snake.x, snake.y);
				if (j + 1 === this.snakes[i].length) {
					cell.style["background"] = "url(./head.png) no-repeat " + this.colors[i];
					cell.style["background-size"] = "100%";
				} else {
					cell.style["background"] = "none";
					cell.style["background-color"] = this.colors[i];
				}
			});
			info += ("Player " + i + " (" + this.colors[i] + ") length = " + this.lengths[i] + "\n");
		}
		if (this.intervalId) {
			d.getElementById("result").innerText = info;
		}
	}

	findFreeCells(_field, head) {
		return _field.filter(_ => (Math.abs(_.x - head.x) + Math.abs(_.y - head.y) === 1
					|| Math.abs(_.x - head.x) === this.size - 1 && Math.abs(_.y - head.y) === 0
					|| Math.abs(_.x - head.x) === 0 && Math.abs(_.y - head.y) === this.size - 1)
					&& _.t < 0);
	}

	getCell(d, x, y) {
		return d.getElementById("cell" + (x - 1) + "x" + y);
	}

	checkIsFree(x, y) {
		return this.field.filter(cell => (cell.x === x && cell.y === y && cell.t === -1));
	}

	addFood() {
		let food = this.field.filter(cell => cell.t === -2);
		if (food.length < this.foods) {
			let foodX;
			let foodY;
			do {
				foodX = ((Math.random() * this.size) | 0) + 1;
				foodY = ((Math.random() * this.size) | 0);
			} while (!this.checkIsFree(foodX, foodY));
			this.field.filter(cell => cell.x === foodX && cell.y === foodY)[0].t = -2;
		}
	}

}

(function (d) {
	let server = new Server([new Player1(0), new Player1(1), new Player1(2)]);
	let grid = d.createElement("div");
	grid.setAttribute("id", "grid");
	for (let i = 0; i < server.size * server.size; i++) {
		let cell = d.createElement("div");
		let x = i % server.size + 1;
		let y = Math.floor(i / server.size);
		cell.setAttribute("class", "cell");
		cell.setAttribute("id", "cell" + (x - 1) + "x" + y);
		cell.style["grid-column"] = i % server.size + 1;
		cell.style["grid-size"] = i;
		//cell.innerText = i;
		grid.appendChild(cell);
		server.field.push({x: x, y: y, t: -1});
	}
	let result = d.createElement("div");
	result.setAttribute("id", "result");
	window.onload = function () {
		d.body.appendChild(grid);
		d.body.appendChild(result);
		server.start(document);
	};
})(document);