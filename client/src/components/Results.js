import React from 'react';
import _ from 'lodash';
import ResultsCell from './ResultsCell';

export default class Server extends React.PureComponent {

	getSnakes() {
		fetch('/api/snakes', {method: 'post'})
				.then(result => result.json())
				.then(result => this.setState({players: result.snakes.split`,`, count: result.snakes.split`,`.length + 1}));
	}

	resetResults() {
		localStorage.removeItem("results");
		window.location.reload();
	}

	constructor(props) {
		super(props);
		this.state = {
			players: [],
			count: 0,
		};
		this.getSnakes();
	}

	render() {
		return (
				<div className="results">
					<input type="button" value="Reset Results" onClick={this.resetResults.bind(this)} className="results__reset"/>
					{_.times(this.state.count * (this.state.count + 1)).map(tile => (
										<ResultsCell key={tile}
													count={tile}
													size={this.state.count}
													players={this.state.players.map(_ => _.substring(0, _.lastIndexOf(".js")))}
													results={this.props.results}
													ref={"cell" + tile % this.state.count + "x" + Math.floor(tile / this.state.count)}
													/>
									))}
				</div>
				);
	}
};