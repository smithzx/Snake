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
		let cells = this.findFreeCells(field, head);
		if (cells.right) {
			return cells.right;
		} else if (cells.top) {
			return cells.top;
		} else if (cells.left) {
			return cells.left;
		} else if (cells.bottom) {
			return cells.bottom;
		} else {
			return;
		}
	}

	findFreeCells(field, head) {
		let size = Math.sqrt(field.length);
		let top = field.filter(_ => _.x - head.x === 0 && (_.y - head.y === size - 1 || head.y - _.y === 1) && _.t < 0)[0];
		let left = field.filter(_ => _.y - head.y === 0 && (_.x - head.x === size - 1 || head.x - _.x === 1) && _.t < 0)[0];
		let bottom = field.filter(_ => _.x - head.x === 0 && (head.y - _.y === size - 1 || _.y - head.y === 1) && _.t < 0)[0];
		let right = field.filter(_ => _.y - head.y === 0 && (head.x - _.x === size - 1 || _.x - head.x === 1) && _.t < 0)[0];
		return {top: top, left: left, bottom: bottom, right: right};
	}
}
