import React from 'react';
import _ from 'lodash';

export default function Info( {info, text2, color}) {

	return (
			<div className="info">
				<table className="info__table">
					<tbody>
						{info.map((line, i) => <tr key={i}>
							<td>
								{"#" + i}
							</td>
							<td>
								{line.player}
							</td>
							<td style={{backgroundColor: line.color, color: line.color === "black" ? "#39C2D7" : "black"}}>
								{line.color}
							</td>
							<td>
								{_.padStart(line.length, 3, " 0")}
							</td>
							<td>
								{_.padStart(line.time, 8, " 00")}
							</td>
						</tr>)}
					</tbody>
				</table>
				<div className="info__result" style={{backgroundColor: color || "#39C2D7", color: color === "black" ? "#39C2D7" : "black"}}>
					{text2.split`\n`.map((line, i) => <span key={i}>{line}<br/></span>)}
				</div>
			</div>
				);
	};