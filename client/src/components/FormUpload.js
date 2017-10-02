import React from 'react';
import Dropzone from 'react-dropzone';

export default class FormUpload extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			status: "We are waiting for new blood!"
		};
	}

	onDrop(acceptedFiles, rejectedFiles) {
		let file = acceptedFiles[0];
		if (file) {
			this.setState({status: "File is uploading..."});
			var data = new FormData();
			data.append('snake', new Blob([file]), this.refs.name.value || file.name);
			fetch('/api/upload', {
				method: 'post',
				body: data,
			}).then(response => {
				if (response.status >= 200 && response.status < 300) {
					return response.json();
				} else {
					throw response.json();
				}
			}).then(data => window.location.reload())
					.catch(error => {
						if (error.then) {
							error.then(data => this.setState({status: data.message}));
						} else {
							this.setState({status: error});
						}
					});
		} else {
			this.setState({status: "Choose the file!"});
		}
	}

	render() {
		return (
				<div className="formupload">        
					<input className="formupload__name" ref="name" type="text" name="name" placeholder="Name:&#128013; (Optional)"/>
					<Dropzone className="formupload__file" onDrop={this.onDrop.bind(this)}>Upload Your Snake</Dropzone>
					<div className="formupload__status">{this.state.status}</div>
				</div>
				);
	}
};