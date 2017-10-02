import React, { Component } from 'react';
import logo from './EPAM_LOGO_White_type_RGB.png';
import MainPage from './components/MainPage';
import './styles/App.css';

class App extends Component {
	state = {users: []}

	render() {
		return (
				<div className="app">
					<div className="app__header">
						<img src={logo} className="app__logo" alt="logo" />
					</div>
					<MainPage/>
				</div>
				);
	}
};

window.onbeforeunload = () => true;

export default App;
