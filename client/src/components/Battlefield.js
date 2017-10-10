import React from 'react';
import _ from 'lodash';
import BattlefieldCell from './BattlefieldCell';
import * as Players from "../snakes";

export default class Battlefield extends React.PureComponent {

	//consts

	size = 25;
	foods = 5;
	speed = 50;
	timelimit = 100;
	length = 8;//must be < 10
	colors = ["salmon", "yellowgreen", "cornflowerblue", "orange", "lightseagreen", "violet",
		"brown", "cyan", "magenta", "yellow", "red", "green", "blue", "lime", "purple"];
	game = {};

	type = {FREE: -1, FOOD: -2};

	componentWillReceiveProps(nextProps) {
		if ((nextProps.inplay && !this.state.inplay) || this.props.replay !== nextProps.replay) {
			this.start(nextProps.players, nextProps.replay);
		}
	}

	start(players, replay) {
		console.log("start");
		this.field = [];
		this.players = [];
		this.snakes = [];
		this.game = {replay: replay};
		this.props.stopGame("when started");
		this.lengths = new Array(players.length + 1).join(this.length).split("").map(_ => Number(_));
		for (let i = 0; i < this.size * this.size; i++) {
			let x = i % this.size;
			let y = Math.floor(i / this.size);
			this.field.push({x: x, y: y, t: this.type.FREE});
			this.getCell(x, y).setState({player: this.type.FREE});
		}
		this.props.setInfo("", "", false, "#39C2D7");
		if (players.length > 0) {
			if (!Object.keys(replay).length) {
				const filteredPlayers = players.filter(player => Players[player]);
				this.game.heads = [];
				this.game.colors = [];
				this.game.steps = [];
				for (let i = 0; i < filteredPlayers.length; i++) {
					this.players.push({
						name: filteredPlayers[i],
						clazz: new Players[filteredPlayers[i]](i)
					});
					this.snakes.push([]);
					this.game.colors.push(this.getColor(i));
					this.addHead(i);
				}
				this.game.players = this.players.map(player => player.name);
				this.intervalId = setInterval(this.makeSteps.bind(this), this.props.speed);
			} else {
				console.log("replay");
				this.game.heads = [];
				for (let i = 0; i < players.length; i++) {
					this.players.push({
						name: players[i]
					});
					this.snakes.push([]);
					this.addHead(replay.heads[i].p, replay.heads[i]);
				}
				this.stepId = 0;
				this.intervalId = setInterval(this.replayGame.bind(this, replay), this.props.speed / players.length);
			}
			this.setState({inplay: true});
		}
	}

	stop(ex) {
		this.setState({inplay: false});
		console.log("stop", ex);
		clearInterval(this.intervalId);
		if (ex !== "when started" && Object.keys(this.game).length > 1 && !Object.keys(this.game.replay).length) {
			this.game.result = ex;
			fetch('/api/save', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(this.game),
			}).then(() => this.game = {})
		}
	}

	addHead(i, _head) {
		let free = this.field.filter(cell => cell.t === this.type.FREE);
		if (free.length > 0) {
			let head = _head
					? free.map((_, i) => {
						if (_.x === _head.x && _.y === _head.y) {
							return i;
						}
					}).filter(_ => typeof _ !== "undefined")[0]
					: ((Math.random() * free.length) | 0);
			this.snakes[i].push({x: free[head].x, y: free[head].y});
			free[head].t = i;
			let cell = this.getCell(free[head].x, free[head].y);
			this.game.heads.push({p: i, x: free[head].x, y: free[head].y});
			cell.setState({player: i, head: true});
		}
	}

	makeSteps() {
		this.addFood();
		let times = {};
		let steps = [];
		for (let i = 0; i < this.players.length; i++) {
			let time = performance.now();
			try {
				let step = this.players[i].clazz.makeStep(_.cloneDeep(this.field), _.cloneDeep(this.snakes));
				if (!step || !this.checkStep(i, step)) {
					this.game.steps.push({p: i, x: step && step.x, y: step && step.y, t: 1000000});
					let head = this.snakes[i][this.snakes[i].length - 1];
					throw {
						message: "#" + i + " " + this.props.players[i] + " (" + this.getColor(i) + ") lose!\n"
								+ " head: " + (head ? "(" + head.x + ", " + head.y + ")" : " empty") + " >>"
								+ " step: " + (step ? "(" + step.x + ", " + step.y + ")" : " empty")
					};
				} else {
					let type = this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t;
					if (type === this.type.FOOD) {
						this.lengths[i]++;
					}
					if (this.snakes[i].length > this.lengths[i] - 1) {
						let free = this.snakes[i].splice(0, 1)[0];
						this.field.filter(cell => cell.x === free.x && cell.y === free.y)[0].t = this.type.FREE;
						let cell = this.getCell(free.x, free.y);
						cell.setState({player: this.type.FREE});
					}
					this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t = i;
					let head = this.snakes[i][this.snakes[i].length - 1];
					let oldHead = this.getCell(head.x, head.y);
					steps.push({head: head, step: step});
					this.snakes[i].push({x: step.x, y: step.y});
					let cell = this.getCell(step.x, step.y);
					let rotate = this.getRotate(step, head);
					cell.setState({player: i, head: true, rotate: rotate});
					oldHead.setState({player: i, head: false});
					let newTime = performance.now() - time;
					times[i] = newTime;
					if (newTime > this.timelimit) {
						throw {
							message: "#" + i + " " + this.props.players[i] + " (" + this.getColor(i) + ") lose!\nTime: "
									+ newTime.toFixed(3) + " > time limit: " + this.timelimit
						};
					}
					this.game.steps.push({p: i, x: step.x, y: step.y, t: newTime.toFixed(3)});
				}
			} catch (ex) {
				this.props.stopGame(ex);
				this.intervalId = null;
				if (this.players.length === 2) {
					let winnerName = this.players[1 - i]
					let looserName = this.players[i]
					this.props.setInfo("", ex.message + "\n\n winner: " + winnerName.name, true, this.getColor(i));
					this.props.addResult(winnerName.name, looserName.name);
				} else {
					this.props.setInfo("", ex.message, true, this.getColor(i));
				}
			}
		}
//		this.printField(steps);
		let info = [];
		for (let i = 0; i < this.players.length; i++) {
			info.push({
				length: this.lengths[i],
				time: times[i] && times[i].toFixed(3),
				player: this.props.players[i],
				color: this.getColor(i)
			});
		}
		if (this.intervalId) {
			this.props.setInfo(info, "");
		}
	}

	replayGame(game) {
		let steps = [];
		let step = game.steps[this.stepId];
		try {
			if (!step || step.t === 1000000) {
				let head = this.snakes[step.p][this.snakes[step.p].length - 1];
				throw {
					message: "#" + step.p + " " + game.players[step.p] + " (" + game.colors[step.p] + ") lose!\n"
							+ " head: " + (head ? "(" + head.x + ", " + head.y + ")" : " empty") + " >>"
							+ " step: " + (step && step.x ? "(" + step.x + ", " + step.y + ")" : " empty")
				};
			} else if (step.p === this.type.FOOD) {
				this.addFood(step);
			} else if (!this.checkStep(step.p, step)) {
				let head = this.snakes[step.p][this.snakes[step.p].length - 1];
				throw {
					message: "#" + step.p + " " + game.players[step.p] + " (" + game.colors[step.p] + ") lose!\n"
							+ " head: " + (head ? "(" + head.x + ", " + head.y + ")" : " empty") + " >>"
							+ " step: " + (step ? "(" + step.x + ", " + step.y + ")" : " empty")
				};
			} else {
				let type = this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t;
				if (type === this.type.FOOD) {
					this.lengths[step.p]++;
				}
				if (this.snakes[step.p].length > this.lengths[step.p] - 1) {
					let free = this.snakes[step.p].splice(0, 1)[0];
					this.field.filter(cell => cell.x === free.x && cell.y === free.y)[0].t = this.type.FREE;
					let cell = this.getCell(free.x, free.y);
					cell.setState({player: this.type.FREE});
				}
				this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t = step.p;
				let head = this.snakes[step.p][this.snakes[step.p].length - 1];
				let oldHead = this.getCell(head.x, head.y);
				steps.push({head: head, step: step});
				this.snakes[step.p].push({x: step.x, y: step.y});
				let cell = this.getCell(step.x, step.y);
				let rotate = this.getRotate(step, head);
				cell.setState({player: step.p, head: true, rotate: rotate});
				oldHead.setState({player: step.p, head: false});
			}
		} catch (ex) {
			this.props.stopGame(ex);
			this.intervalId = null;
			if (game.players.length === 2) {
				let winnerName = game.players[1 - step.p]
				let looserName = game.players[step.p]
				this.props.setInfo("", ex.message + "\n\n winner: " + winnerName, true, game.colors[step.p]);
				//this.props.addResult(winnerName, looserName);
			} else {
				this.props.setInfo("", ex.message, true, game.colors[step.p]);
			}
		}
		let info = [];
		for (let i = 0; i < game.players.length; i++) {
			info.push({
				length: this.lengths[i],
				time: this.getLastStepTime(game.steps, this.stepId, i),
				player: this.props.players[i],
				color: game.colors[i]
			});
		}
		if (this.intervalId) {
			this.props.setInfo(info, "");
		}
		this.stepId++;
		if (this.stepId === game.steps.length) {
			this.props.stopGame("replay ended");
		}
	}

	getLastStepTime(steps, stepId, playerId) {
		let past = steps.slice(0, stepId + 1);
		for (let i = stepId; i > 0; i--) {
			if (past[i].p === playerId) {
				return past[i].t;
			}
		}
	}

	getRotate(step, head) {
		if (step.x === head.x) {
			if (step.y - head.y === 1 || head.y - step.y === this.size - 1) {
				return 0;
			} else if (step.y - head.y === -1 || step.y - head.y === this.size - 1) {
				return 180;
			}
		}
		if (step.y === head.y) {
			if (step.x - head.x === 1 || head.x - step.x === this.size - 1) {
				return 270;
			} else if (step.x - head.x === -1 || step.x - head.x === this.size - 1) {
				return 90;
			}
		}
		return 0;
	}

	printField(steps) {
		let result = "";
		for (let i = 0; i < this.size * this.size; i++) {
			let x = i % this.size;
			let y = Math.floor(i / this.size);
			if (x === 0 && y !== 0) {
				result += "\n"
			}
			result += this.field.filter(cell => cell.x === x && cell.y === y)[0].t + "\t";
		}
		console.log(result, steps, _.clone(this.snakes[0]));
	}

	checkStep(i, step) {
		let snake = this.snakes[i];
		let head = snake.slice(snake.length - 1)[0];
		if (!step || typeof step.x === "undefined" || typeof step.y === "undefined" || (true
				&& Math.abs(step.x - head.x) + Math.abs(step.y - head.y) > 1
				&& Math.abs(step.x - head.x) + Math.abs(step.y - head.y) < this.size - 1)
				|| this.field.filter(cell => cell.x === step.x && cell.y === step.y)[0].t >= 0) {
			return false;
		}
		return true;
	}

	getCell(x, y) {
		return this.refs["cell" + x + "x" + y];
	}

	checkIsFree(x, y) {
		return this.field.filter(cell => (cell.x === x && cell.y === y && cell.t === this.type.FREE));
	}

	addFood(_food) {
		let foods = this.field.filter(cell => cell.t === this.type.FOOD);
		if (foods.length < this.foods) {
			let free = this.field.filter(cell => cell.t === this.type.FREE);
			if (free.length > 0) {
				let food = _food
						? free.map((_, i) => {
							if (_.x === _food.x && _.y === _food.y) {
								return i;
							}
						}).filter(_ => typeof _ !== "undefined")[0]
						: ((Math.random() * free.length) | 0);
				this.field.filter(cell => cell.x === free[food].x && cell.y === free[food].y)[0].t = this.type.FOOD;
				let cell = this.getCell(free[food].x, free[food].y);
				cell.setState({player: this.type.FOOD});
				!_food && this.game.steps.push({p: this.type.FOOD, x: free[food].x, y: free[food].y});
			}
		}
	}

	getColor(i) {
		return (this.players[i] && this.players[i].clazz && this.players[i].clazz.getColor)
				? this.players[i].clazz.getColor()
				: this.game.replay && this.game.replay.colors
				? this.game.replay.colors[i]
				: this.colors[i % this.colors.length];
	}

	//////////////

	constructor(props) {
		super(props);
		this.state = {
			players: this.props.players,
			count: this.props.players.length,
			inplay: false
		};
		this.intervalId;
		this.getColor = this.getColor.bind(this);
		this.stop = this.stop.bind(this);
	}

	getStyles() {
		return {
			display: "grid",
			gridTemplateColumns: `repeat(${this.size}, 1fr)`,
			gridAutoRows: `repeat(${this.size}, 1fr)`
		};
	}

	render() {
		return (
				<div className="battlefield" style={this.getStyles()}>
					{_.times(this.size * this.size).map(tile => (
										<BattlefieldCell key={tile}
														 count={tile}
														 size={this.size}
														 ref={"cell" + tile % this.size + "x" + Math.floor(tile / this.size)}
														 getColor={this.getColor}
														 />
									))}
				</div>
				);
	}

};