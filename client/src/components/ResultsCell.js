import React from 'react';
import _ from 'lodash';
import cups from '../cups.svg';
export default class ResultsCell extends React.PureComponent {

	getStyles() {
		return {
			gridColumn: this.props.count % this.props.size + 1,
			gridSize: this.props.count,
			height: (this.props.count === 0) ? "50px" : "auto",
			display: "table-cell",
			verticalAlign: "bottom",
			background: (this.props.count === 0)
					? `url(${cups}) 0% 0% / 100% no-repeat`
					: (this.props.count === this.props.size * this.props.size)
					? "#A3C644"
					: (this.props.count - 1 < this.props.players.length || this.props.count % this.props.size === 0)
					? "#39C2D7"
					: "white",
			borderTop: this.props.count < this.props.size ? "2px #666666 solid" : "none",
			borderRight: this.props.count % this.props.size === this.props.size - 1 ? "2px #666666 solid" : "1px #999999 solid",
			borderBottom: this.props.count > (this.props.size - 1) * this.props.size - 1 ? "2px #666666 solid" : "1px #999999 solid",
			borderLeft: this.props.count % this.props.size === 0 ? "2px #666666 solid" : "none",
			padding: "4px",
			fontSize: "14px"
		};
	}

	getValue() {
		return (this.props.count - 1 < this.props.players.length)
				? this.props.players[this.props.count - 1]
				: (this.props.count === this.props.size * this.props.size)
				? "TOTALS:"
				: (this.props.count % this.props.size === 0)
				? this.props.players[this.props.count / this.props.size - 1]
				: (this.props.count > this.props.size * this.props.size)
				? _.sumBy(_.filter(this.props.results, {
					name1: this.props.players[this.props.count - this.props.size * this.props.size - 1]
				}).filter(result => this.props.players.includes[result.name2]), "value")
				: (this.props.count % (this.props.size + 1) === 0)
				? "X"
				: _.filter(this.props.results, {
					name1: this.props.players[this.props.count % this.props.size - 1],
					name2: this.props.players[Math.floor(this.props.count / this.props.size - 1)]
				}).length
				? _.head(_.filter(this.props.results, {
					name1: this.props.players[this.props.count % this.props.size - 1],
					name2: this.props.players[Math.floor(this.props.count / this.props.size - 1)]
				})).value
				: "-";
	}

	render() {
		return (<div className="resultcell"style={this.getStyles()}>{this.getValue()}</div>);
	}
};