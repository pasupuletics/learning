import React, { Component } from 'react';
import { PieChart } from 'react-d3-basic';
import { PieTooltip } from 'react-d3-tooltip';


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
		const generalChartData = this.props.users;
		const width = this.props.width || 300;
	    const height = this.props.height || 300;
	    const innerRadius = 20;
	    const chartSeries = this.props.chartSeries;

		return (
			<div id="users-chart">
				<PieTooltip
			      data= {generalChartData}
			      width= {width}
			      height= {height}
			      chartSeries= {chartSeries}
			      value = {this.value}
			      name = {this.name}
			      innerRadius = {innerRadius}
			      title = "DOnut"
				/>
			</div>
		)
	}
}
