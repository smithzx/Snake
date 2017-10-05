import React from 'react';

export default class SnakesList extends React.PureComponent {
	state = {snakes: ""}

	componentDidMount() {
		this.getSnakes();
	}

	getSnakes() {
		fetch('/api/snakes', {method: 'post'})
				.then(result => result.json())
				.then(result => this.setState({snakes: result.snakes}));
	}

	selectPlayer(e) {
		this.props.selectPlayer(e.target.value);
	}

	deleteSnake(name) {
		if (!name.startsWith("_")) {
			if (this.props.players.includes(name)) {
				this.props.selectPlayer(name);
			}
			fetch('/api/delete', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: name}),
			}).then(() => this.getSnakes());
		} else {
			alert("Forbidden!");
		}
	}

	render() {
		return (
				<div className="snakeslist">
					<input type="button" value="Update Snakes List" onClick={this.getSnakes.bind(this)}/>
					<ul className="snakeslist__checkboxes">
						{
							this.state.snakes.split`,`.map(_ => _.substring(0, _.lastIndexOf(".js"))).map((_, i) =>
								<li key={i}><label>
										<input type="checkbox" name={_} value={_} disabled={this.props.disabled}
											   onChange={this.selectPlayer.bind(this)} checked={this.props.players.includes(_)}/>{_}</label>
									<input className="delete" type="button" name={_} value="delete" 
										   disabled={this.props.disabled} onClick={this.deleteSnake.bind(this, _)}/></li>)
						}
					</ul>				
				</div>
				);
	}
};