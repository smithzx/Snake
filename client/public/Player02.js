var Player02 = function (i) {
	this.i = i;
};
/**
 * 
 * @param field - whole field with cells types
 * @param snakes - arrays of snakes cells
 * @returns {x: X, y: Y} - place to go near head
 */
Player02.prototype.makeStep = function (field, snakes) {
	var type = {};
	type.FREE = -1;
	type.FOOD = -2;
	type.ME = this.i;

	var snake = snakes[this.i];
	var head = snake.slice(snake.length - 1)[0];
	var cells = this.findFreeCells(field, head);
	var selectedCell = (Math.random() * cells.length) | 0;
	return cells[selectedCell];
};

Player02.prototype.findFreeCells = function (field, head) {
	var size = Math.sqrt(field.length);
	return field.filter(_ => (Math.abs(_.x - head.x) + Math.abs(_.y - head.y) === 1
				|| Math.abs(_.x - head.x) === size - 1 && Math.abs(_.y - head.y) === 0
				|| Math.abs(_.x - head.x) === 0 && Math.abs(_.y - head.y) === size - 1)
				&& _.t < 0);
};

export default Player02;