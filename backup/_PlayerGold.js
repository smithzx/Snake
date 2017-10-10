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
		let cell = this.findNearestFood(field, head);
		return cell;
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

	getColor() {
		return "gold";
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
				let cell = this.field.filter(_ => _.x === i && _.y === j)[0];
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
		let cell = this.field.filter(_ => _.x === x && _.y === y)[0];
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
