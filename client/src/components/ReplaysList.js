import React from 'react';

export default class ReplaysList extends React.PureComponent {
	state = {replays: ""}

	componentDidMount() {
		this.getReplays();
	}

	getReplays() {
		fetch('/api/replays', {method: 'post'})
				.then(result => result.json())
				.then(result => this.setState({replays: result.replays}));
	}

	replayGame(name) {
		let replayGame = this.props.replayGame;
		fetch('/api/replay', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({name: name}),
		}).then(result => result.json())
				.then(result => replayGame(result.replay));
	}

	render() {
		return (
				<div className="replayslist">
					<input type="button" value="Update Replays List" onClick={this.getReplays.bind(this)}/>
					<ul className="replayslist__list">
						{
							this.state.replays && this.state.replays.split`,`.map(_ => _.substring(0, _.lastIndexOf(".json"))).reverse().map((_, i) =>
								<li key={i}><label>{_}</label>
									<input className="replay" type="button" name={_} value="replay" onClick={this.replayGame.bind(this, _)}/></li>)
						}
					</ul>				
				</div>
				);
	}
};