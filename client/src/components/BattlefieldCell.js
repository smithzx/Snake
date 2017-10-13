import React from 'react';
import apple from '../images/apple.png';
//import head from '../images/head.png';

export default class BattlefieldCell extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			count: this.props.count,
			size: this.props.size,
			player: -1,
			rotate: 0
		};
		this.bg = {};
		this.bg.FREE = this.props.size % 2 === 0
				? (this.props.count % this.props.size < this.props.size && this.props.count % (this.props.size * 2) < this.props.size
						? (this.props.count % 2 === 0 ? "white" : "lightgray")
						: (this.props.count % 2 === 1 ? "white" : "lightgray"))
				: (this.props.count % 2 === 0 ? "white" : "lightgray");
		this.bg.FOOD = `${this.bg.FREE} url(${apple}) 0% 0% / 100% no-repeat`;
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextState.player > -1) {
			this.bg.HEAD = `url(../images/head.png) 0% 0% / 100% no-repeat ${nextProps.getColor(nextState.player)}`;
			this.bg.TAIL = nextProps.getColor(nextState.player);
		}
	}

	getStylesCell() {
		let bg = this.bg.FREE;
		let tr = `rotate(0deg)`;
		switch (this.state.player) {
			case - 2:
				bg = this.bg.FOOD
				break;
			case - 1:
				bg = this.bg.FREE
				break;
			default:
				bg = this.state.nextCell ? this.bg.TAIL : this.bg.HEAD
				tr = this.state.nextCell ? `rotate(0deg)` : `rotate(${this.state.rotate || 0}deg)`;
				break;
		}
		return {
			background: bg,
			transform: tr,
			width: "100%",
			height: "100%"
		};
	}

	getStylesContainer() {
		let x = this.props.count % this.props.size;
		let y = Math.floor(this.props.count / this.props.size);
		let borderTop = this.props.borders && (this.state.player > -1
					&& !((this.state.prevCell && (y - this.state.prevCell.y === 1 || this.state.prevCell.y - y === this.props.size - 1))
					|| (this.state.nextCell && (y - this.state.nextCell.y === 1 || this.state.nextCell.y - y === this.props.size - 1))));
		let borderRight = this.props.borders && (this.state.player > -1
					&& !((this.state.prevCell && (this.state.prevCell.x - x === 1 || x - this.state.prevCell.x === this.props.size - 1))
					|| (this.state.nextCell && (this.state.nextCell.x - x === 1 || x - this.state.nextCell.x === this.props.size - 1))));
		let borderBottom = this.props.borders && (this.state.player > -1
					&& !((this.state.prevCell && (this.state.prevCell.y - y === 1 || y - this.state.prevCell.y === this.props.size - 1))
					|| (this.state.nextCell && (this.state.nextCell.y - y === 1 || y - this.state.nextCell.y === this.props.size - 1))));
		let borderLeft = this.props.borders && (this.state.player > -1
					&& !((this.state.prevCell && (x - this.state.prevCell.x === 1 || this.state.prevCell.x - x === this.props.size - 1))
					|| (this.state.nextCell && (x - this.state.nextCell.x === 1 || this.state.nextCell.x - x === this.props.size - 1))));
		return {
			gridColumn: this.props.count % this.props.size + 1,
			borderTop: borderTop ? "1px black solid" : this.props.count < this.props.size ? "2px #39C2D7 solid" : "none",
			borderRight: borderRight ? "1px black solid" : this.props.count % this.props.size === this.props.size - 1 ? "2px #39C2D7 solid" : "1px #999999 solid",
			borderBottom: borderBottom ? "1px black solid" : this.props.count > (this.props.size - 1) * this.props.size - 1 ? "2px #39C2D7 solid" : "1px #999999 solid",
			borderLeft: borderLeft ? "1px black solid" : this.props.count % this.props.size === 0 ? "2px #39C2D7 solid" : "none",
			marginTop: borderTop ? "-1px" : 0,
			marginLeft: borderLeft ? "-1px" : 0
		};
	}

	render() {
		return (
				<div
					style={this.getStylesContainer()}>
					<div 
						className="battlefield__cell"
						style={this.getStylesCell()}
						type={this.state.player}
						/>
				</div>
				);
	}
};