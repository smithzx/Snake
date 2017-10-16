class Player1 {

	constructor(i) {
		this.i = i;
	}

	makeStep(field, snakes) {
		let type = {};
		type.FREE = -1;
		type.FOOD = -2;

		let snake = snakes[this.i];
		let head = snake.slice(snake.length - 1)[0];
		let free = snake.splice(0, 1)[0];
		field.filter(cell => cell.x === free.x && cell.y === free.y)[0].t = -1;
		let cells = this.findFreeCells(field, head);
		let food = cells.filter(cell => cell.t === -2);
		if (food.length > 0) {
			return food[0];
		}
		let selectedCell = (Math.random() * cells.length) | 0;
		if (cells.length > 1) {
			let cells2 = this.findFreeCells(field, cells[selectedCell]);
			if (!cells2.length) {
				switch (selectedCell) {
					case 0:
						selectedCell++;
						break;
					case 1:
						if (cells.length > 2) {
							selectedCell++;
						} else {
							selectedCell = 0;
						}
						break;
					case 2:
						selectedCell = 0;
						break;
				}
			}
		}
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
