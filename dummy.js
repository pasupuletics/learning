import React, {Component} from 'react'

import UsersChart from './UsersChart.jsx'

export default class UsersInfo extends Component {
	render() {
		const users = this.props.users;
		const chartSeries = [
	      {
	        "field": "West Josiemouth",
	        "name": "West Josiemouth"
	      },
	      {
	        "field": "Annatown",
	        "name": "Annatown"
	      },
	      {
	        "field": "South Eldredtown",
	        "name": "South Eldredtown"
	      },
	      {
	        "field": "Koeppchester",
	        "name": "Koeppchester"
	      }
	    ];

		return (
			<div id="users-info">
				<UsersChart users={users} chartSeries={chartSeries} width={300} height={300}/>
			</div>
		);
	}
} 
