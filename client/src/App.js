import React from 'react';
import MainPage from './components/MainPage';
import Header from './components/Header';
import './styles/App.css';

class App extends React.PureComponent {

	state = {users: []};

	render() {
		return (
				<div className="app">
					<Header/>
					<MainPage/>
				</div>
				);
	}
};

window.onbeforeunload = () => true;

export default App;
