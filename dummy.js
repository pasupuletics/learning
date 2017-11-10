import React, { Component } from 'react';
import { PieTooltip, SimpleTooltip } from 'react-d3-tooltip';


export default class UsersChat extends Component {
	constructor(props) {
		super(props);

	}
	value(d) {
	    return d.BMI;
	}

    name(d) {
      return d.city;
    }

	render() {
		const width = this.props.width || 300;
	    const height = this.props.height || 300;

		return (
			<div id="users-chart">
				<PieTooltip
				  {...this.props}
			      width= {width}
			      height= {height}
			      value = {this.value}
			      name = {this.name}
			      innerRadius = {20}
			      title = "DOnut"
			      swatchShape = "circle"
				>
					<SimpleTooltip />
				</PieTooltip>
			</div>
		)
	}
}






import React, {Component} from 'react'

import UsersList from './UsersList.jsx'
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
				<UsersList users={users}/>
				<UsersChart 
					data={users} 
					chartSeries={chartSeries} 
					width={300} 
					height={300}
					pieTextShow={false}
				/>
			</div>
		);
	}
} 
