import React from 'react';
import _ from 'lodash';
import FormUpload from './FormUpload';
import SnakesList from './SnakesList';
import StartGame from './StartGame';
import ReplaysList from './ReplaysList';
import Battlefield from './Battlefield';
import Results from './Results';
import Info from './Info';
import Example from './Example';

export default class MainPage extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			players: [],
			results: JSON.parse(localStorage.getItem("results")) || [],
			info: [],
			text2: "",
			color: "#39C2D7",
			speed: 950
		};

		this.addResult = this.addResult.bind(this);
		this.startGame = this.startGame.bind(this);
		this.replayGame = this.replayGame.bind(this);
		this.stopGame = this.stopGame.bind(this);
		this.selectPlayer = this.selectPlayer.bind(this);
		this.changeSpeed = this.changeSpeed.bind(this);
		this.setInfo = this.setInfo.bind(this);
	}

	addResult(winnerName, looserName) {
		this.setState(({results}) => {
			let resultWinner = _.remove(results, {name1: winnerName, name2: looserName});
			let resultLooser = _.remove(results, {name1: looserName, name2: winnerName});
			if (resultWinner.length === 0 || resultLooser.length === 0) {
				let newResultWinner = {name1: winnerName, name2: looserName, value: 1};
				let newResultLooser = {name1: looserName, name2: winnerName, value: -1};
				let newResults = results.concat([newResultWinner, newResultLooser]);
				localStorage.setItem("results", JSON.stringify(newResults));
				return {results: newResults};
			} else {
				resultWinner[0].value++;
				resultLooser[0].value--;
				let newResults = results.concat([resultWinner[0], resultLooser[0]]);
				localStorage.setItem("results", JSON.stringify(newResults));
				return {results: newResults};
			}
		});
	}

	startGame() {
		if (this.state.players.length > 0) {
			this.setState({inplay: true});
			this.refs.battlefield.start();
		}
	}

	replayGame(replay) {
		let game = JSON.parse(replay);
		this.setState({players: game.players, inplay: true});
		this.refs.battlefield.start(game);
	}

	stopGame(event) {
		if (event !== "when started") {
			this.setState({inplay: false});
		}
		this.refs.battlefield.stop(typeof (event) === "string" ? event : "stopped by button click");
	}

	selectPlayer(event) {
		let selected = event.nativeEvent.target.value;
		this.setState(({players: oldPlayers}) => {
			let players = [...oldPlayers];
			if (players.includes(selected)) {
				players.splice(players.indexOf(selected), 1);
			} else {
				players.push(selected);
			}
			return {players};
		});
	}

	changeSpeed(event) {
		this.setState({speed: event.nativeEvent.target.value});
	}

	setInfo(info, text2, isAdd, color) {
		if (isAdd) {
			this.setState(({info: prevInfo, text2: prevText2}) => ({
					info: prevInfo,
					text2: prevText2 + text2,
					color: color
				}));
		} else {
			this.setState({info: info || [], text2: text2, color: color});
		}
	}

	render() {
		return (
				<div className="mainpage">
					<FormUpload/>
					<Example/>
					<SnakesList players={this.state.players} selectPlayer={this.selectPlayer} disabled={this.state.inplay}/>
					<StartGame speed={this.state.speed} disabled={this.state.inplay}
							   changeSpeed={this.changeSpeed} startGame={this.startGame} stopGame={this.stopGame}/>
					<ReplaysList replayGame={this.replayGame}/>
					<Battlefield className="battlefield" ref="battlefield" addResult={this.addResult} setInfo={this.setInfo}
								 players={this.state.players} speed={1000 - this.state.speed} replay={this.state.replay}
								 stopGame={this.stopGame}/>
					<Results results={this.state.results}/>
					<Info info={this.state.info} text2={this.state.text2} color={this.state.color} />
				</div>
				);
	}
};