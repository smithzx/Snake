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
		let free = this.findFreeCells(field, head);
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
