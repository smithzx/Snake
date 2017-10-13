import React from 'react';

export default function StartGame({speed, disabled, borders, showBorders, changeSpeed, startGame, stopGame }) {

	return (
			<div className="startgame">
				<span style={{verticalAlign: "super"}}>Speed:</span>
				<input type="range" className="speed" min="0" max="1000" value={speed} onChange={changeSpeed}/>
				<input type="checkbox" className="borders" value={borders} onChange={showBorders} title="Show borders"/>
				<br/>
				<input type="button" className="start" value="Start Game" onClick={startGame} disabled={disabled}/>
				&nbsp;
				<input type="button" className="stop" value="Stop Game" onClick={stopGame} disabled={!disabled}/>
			</div>
			);
};