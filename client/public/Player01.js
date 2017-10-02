export default class Player01 {

	constructor(i) {
		this.i = i;
	}
/**
 * 
 * @param field - whole field with cells types
 * @param snakes - arrays of snakes cells
 * @returns {x: X, y: Y} - place to go near head
 */
	makeStep(field, snakes) {
		let type = {};
		type.FREE = -1;
		type.FOOD = -2;
		type.ME = this.i;

		let snake = snakes[this.i];
		let head = snake.slice(snake.length - 1)[0];
		let cells = this.findFreeCells(field, head);
		let selectedCell = (Math.random() * cells.length) | 0;
		return cells[selectedCell];
	}

	findFreeCells(field, head) {
		let size = Math.sqrt(field.length);
		return field.filter(_ => (Math.abs(_.x - head.x) + Math.abs(_.y - head.y) === 1
					|| Math.abs(_.x - head.x) === size - 1 && Math.abs(_.y - head.y) === 0
					|| Math.abs(_.x - head.x) === 0 && Math.abs(_.y - head.y) === size - 1)
					&& _.t < 0);
	}
}
