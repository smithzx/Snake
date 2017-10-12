import React from 'react';
import logo from '../EPAM_LOGO_White_type_RGB.png';
import tver2 from '../images/tver2.jpg';

export default class MainPage extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			collapsed: false
		};
	}

	getHeaderStyles() {
		return {
			background: `url(${tver2}) 50% 100% / 100% no-repeat`,
			backgroundSize: "cover",
			height: this.state.collapsed ? "10px" : "155px",
			padding: this.state.collapsed ? "0" : "20px",
			color: "white",			
			transition: "height 1s, padding 1s"
		};
	}

	getLogoStyles() {
		return {
			height: this.state.collapsed ? "0" : "80px",			
			transition: "height 1s"
		};
	}

	onClick() {
		this.setState(({collapsed}) => ({collapsed: !collapsed}));
	}

	render() {
		return (
					<div className="app__header" onClick={this.onClick.bind(this)} style={this.getHeaderStyles()}>
						<img src={logo} className="app__logo" alt="logo" style={this.getLogoStyles()}/>
					</div>
				);
	}
};