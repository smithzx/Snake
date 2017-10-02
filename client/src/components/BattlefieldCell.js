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
			head: false,
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
		this.bg.HEAD = `url(../images/head.png) 0% 0% / 100% no-repeat ${nextProps.getColor(nextState.player)}`;
		this.bg.TAIL = nextProps.getColor(nextState.player);
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
				bg = this.state.head ? this.bg.HEAD : this.bg.TAIL
				tr = this.state.head ? `rotate(${this.state.rotate || 0}deg)` : `rotate(0deg)`;
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
		return {
			gridColumn: this.props.count % this.props.size + 1,
			gridSize: this.props.count,
			borderTop: this.props.count < this.props.size ? "2px #39C2D7 solid" : "none",
			borderRight: this.props.count % this.props.size === this.props.size - 1 ? "2px #39C2D7 solid" : "1px #999999 solid",
			borderBottom: this.props.count > (this.props.size - 1) * this.props.size - 1 ? "2px #39C2D7 solid" : "1px #999999 solid",
			borderLeft: this.props.count % this.props.size === 0 ? "2px #39C2D7 solid" : "none",
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