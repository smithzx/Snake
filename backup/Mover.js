import _ from 'lodash';

export default class Player10 {

	constructor(i) {
		this.i = i;
	}

	makeStep(field, snakes) {
		let type = {};
		type.FREE = -1;
		type.FOOD = -2;
		type.ME = this.i;

		let snake = snakes[this.i];
		let head = snake.slice(snake.length - 1)[0];
		if (snake.length < Math.sqrt(field.length) + 1) {
			return this.findNearestFood(field, head);
		} else {
			return this.makeStep2(field, snakes);
		}
	}

	findNearestFood(field, head) {
		let size = Math.sqrt(field.length);
		let food = field.filter(_ => _.t == -2);
		let dist1 = food.map(_ => this.getDistance(_, head, size));
		let nearest = food[dist1.indexOf(Math.min(...dist1))];
		let fieldChecker = new FieldChecker(field);
		field = fieldChecker.checkField();
		let free = this.findFreeCells(field, head);
		if (Math.max(...free.map(_ => _.weight)) !== Math.min(...free.map(_ => _.weight))) {
			free = free.filter(_ => _.weight === Math.max(...free.map(_ => _.weight)));
		}
		let dist2 = free.map(_ => this.getDistance(_, nearest, size));
		return free[dist2.indexOf(Math.min(...dist2))];
	}

	getDistance(src, dst, size) {
		const diffX = Math.abs(src.x - dst.x);
		const diffY = Math.abs(src.y - dst.y);
		return Math.min(diffX, size - diffX) + Math.min(diffY, size - diffY);
	}

	findFreeCells(field, head) {
		let size = Math.sqrt(field.length);
		return field.filter(_ => (Math.abs(_.x - head.x) + Math.abs(_.y - head.y) === 1
					|| Math.abs(_.x - head.x) === size - 1 && Math.abs(_.y - head.y) === 0
					|| Math.abs(_.x - head.x) === 0 && Math.abs(_.y - head.y) === size - 1)
					&& _.t < 0);
	}
	
	makeStep2(field, snakes) {
		let snake = snakes[this.i];
		let head = snake.slice(snake.length - 1)[0];
		let cells = this.findFreeCells2(field, head);
		if (cells.top) {
			return cells.top;
		} else if (cells.left) {
			return cells.left;
		} else if (cells.bottom) {
			return cells.bottom;
		} else if (cells.right) {
			return cells.right;
		} else {
			return;
		}
	}

	findFreeCells2(field, head) {
		let size = Math.sqrt(field.length);
		let top = field.filter(_ => _.x - head.x === 0 && (_.y - head.y === size - 1 || head.y - _.y === 1) && _.t < 0)[0];
		let left = field.filter(_ => _.y - head.y === 0 && (_.x - head.x === size - 1 || head.x - _.x === 1) && _.t < 0)[0];
		let bottom = field.filter(_ => _.x - head.x === 0 && (head.y - _.y === size - 1 || _.y - head.y === 1) && _.t < 0)[0];
		let right = field.filter(_ => _.y - head.y === 0 && (head.x - _.x === size - 1 || _.x - head.x === 1) && _.t < 0)[0];
		return {top: top, left: left, bottom: bottom, right: right};
	}

	getColor() {
		return "tomato";
	}
}

class FieldChecker {
	constructor(field) {
		this.field = field;
		this.size = Math.sqrt(field.length);
		this.result = {0: -1};
	}
	checkField() {
		let num = 1;
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (this.checkCell(i, j, num)) {
					num++;
				}
			}
		}
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				let cell = _.find(this.field, cell => cell.x === i && cell.y === j);
				cell.weight = this.result[cell.num];
			}
		}
		return this.field;
	}
	checkCell(x, y, num) {
		if (x < 0) {
			x += this.size;
		}
		if (x >= this.size) {
			x -= this.size;
		}
		if (y < 0) {
			y += this.size;
		}
		if (y >= this.size) {
			y -= this.size;
		}
		let cell = _.find(this.field, cell => cell.x === x && cell.y === y);
		if (cell.t > -1) {
			cell.num = 0;
			return false;
		}
		if (!cell.num) {
			cell.num = num;
			this.addValue(num);
			this.checkCell(x - 1, y, num);
			this.checkCell(x, y - 1, num);
			this.checkCell(x + 1, y, num);
			this.checkCell(x, y + 1, num);
			return true;
		} else {
			return false;
		}
	}
	addValue(num) {
		if (this.result[num]) {
			this.result[num]++;
		} else {
			this.result[num] = 1;
		}
	}
}
