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
			results: window.localStorage && JSON.parse(localStorage.getItem("results")) || [],
			info: [],
			text2: "",
			color: "#39C2D7",
			speed: 950,
			replay: {},
			fontSize: 24,
			weight: window.localStorage && parseFloat(localStorage.getItem("weight")) || 3
		};

		this.addResult = this.addResult.bind(this);
		this.startGame = this.startGame.bind(this);
		this.replayGame = this.replayGame.bind(this);
		this.stopGame = this.stopGame.bind(this);
		this.selectPlayer = this.selectPlayer.bind(this);
		this.changeSpeed = this.changeSpeed.bind(this);
		this.setInfo = this.setInfo.bind(this);
		this.onIncrement = this.onIncrement.bind(this);
		this.onDecrement = this.onDecrement.bind(this);
		this.onFieldClick = this.onFieldClick.bind(this);
	}

	addResult(winnerName, looserName) {
		this.setState(({results}) => {
			let resultWinner = _.remove(results, {name1: winnerName, name2: looserName});
			let resultLooser = _.remove(results, {name1: looserName, name2: winnerName});
			if (resultWinner.length === 0 || resultLooser.length === 0) {
				let newResultWinner = {name1: winnerName, name2: looserName, value: 1};
				let newResultLooser = {name1: looserName, name2: winnerName, value: -1};
				let newResults = results.concat([newResultWinner, newResultLooser]);
				window.localStorage && localStorage.setItem("results", JSON.stringify(newResults));
				return {results: newResults};
			} else {
				resultWinner[0].value++;
				resultLooser[0].value--;
				let newResults = results.concat([resultWinner[0], resultLooser[0]]);
				window.localStorage && localStorage.setItem("results", JSON.stringify(newResults));
				return {results: newResults};
			}
		});
	}

	shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	startGame() {
		if (this.state.players.length > 0) {
			this.setState(({players}) => {
				return {players: this.shuffleArray(players), inplay: true, replay: {}};
			});
		}
	}

	replayGame(replay) {
		let game = JSON.parse(replay);
		this.setState({players: game.players, inplay: true, replay: game});
	}

	stopGame(result) {
		if (result !== "when started") {
			this.setState({inplay: false});
		}
		this.refs.battlefield.stop(typeof result === "string" ? result : "stopped by button click");
	}

	selectPlayer(name) {
		this.setState(({players: oldPlayers}) => {
			let players = [...oldPlayers];
			if (players.includes(name)) {
				players.splice(players.indexOf(name), 1);
			} else {
				players.push(name);
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

	onIncrement() {
		this.setState(({fontSize}) => ({fontSize: Math.min(40, fontSize + 1)}));
	}
	
	onDecrement() {
		this.setState(({fontSize}) => ({fontSize: Math.max(12, fontSize - 1)}));
	}

	onFieldClick(e) {
		if (e.nativeEvent.which === 1) {//left
			this.setState(({weight}) => {
				let newWeight = Math.min(6, weight + 0.1);
				window.localStorage && localStorage.setItem("weight", newWeight);
				return ({weight: newWeight})
			});
		} else if (e.nativeEvent.which === 3) {//right
			e.preventDefault();
			this.setState(({weight}) => {
				let newWeight = Math.max(2, weight - 0.1);
				window.localStorage && localStorage.setItem("weight", newWeight);
				return ({weight: newWeight})
			});
		}
	}

	render() {
		return (
				<div className="mainpage" style={{gridTemplateColumns: "320px " + this.state.weight + "fr 4fr"}}>
					<FormUpload/>
					<Example/>
					<SnakesList players={this.state.players} selectPlayer={this.selectPlayer} disabled={this.state.inplay}/>
					<StartGame speed={this.state.speed} disabled={this.state.inplay}
							   changeSpeed={this.changeSpeed} startGame={this.startGame} stopGame={this.stopGame}/>
					<ReplaysList replayGame={this.replayGame}/>
					<Battlefield ref="battlefield" addResult={this.addResult} setInfo={this.setInfo}
								 players={this.state.players} speed={1000 - this.state.speed} replay={this.state.replay}
								 stopGame={this.stopGame} inplay={this.state.inplay} onFieldClick={this.onFieldClick}/>
					<Results results={this.state.results}/>
					<Info info={this.state.info} text2={this.state.text2} color={this.state.color}
						  fontSize={this.state.fontSize} onIncrement={this.onIncrement} onDecrement={this.onDecrement}/>
				</div>
				);
	}
};