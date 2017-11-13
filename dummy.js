import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class SPSPieChart extends Component {
  componentDidMount() {
    this._renderPie();
  }

  _renderPie() {
    const {
      data:_dataset,
      width,
      height,
      value,
      name,
      donutWidth,
      id
    }  = this.props;


    const dataset = d3.nest()
        .key(name)
        .rollup((d) => d3.sum(d, value))
        .entries(_dataset)
        .map((g) => Object.create({ label: g.key, count: g.value }));

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal()
                    .range(['#68c8d7','#eccd63','#bb8cdd','#de6942','#52b36e','#bbc7d9']);
    const rootSelector = `#${id}--piechart`;

    const svg = d3.select(`${rootSelector} .pie`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    var arcOR = radius - 20;

    var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(arcOR);

    var selectedOR = arcOR + 5;

    var arcSelected = d3.arc()
      .innerRadius(arcOR + 5)
      .outerRadius(selectedOR);

    var hoverOR = selectedOR + 10;

    var arcOver = d3.arc()
      .innerRadius(selectedOR)
      .outerRadius(hoverOR);

    var pie = d3.pie()
      .padAngle(.02)
      .value(value)
      .sort(null);

    var path = svg.selectAll('path.arc-default')
      .data(pie(dataset))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(name(d.data)))
      .attr('class', 'arc-default')
      .each((d) => this._current = d);

    var legendRectSize = 15;
    var legendSpacing = 4;

    var svgLegend = d3.select(`${rootSelector} .legend`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(50 , ${height / 2})`);
    
    var legend = svgLegend.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return `translate(${horz}, ${vert})`;
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('rx', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text((d) => d);

    var tooltip = d3.select(`#${id}--piechart`)
      .append('div')
      .attr('class', 'd3-pie--tooltip');

    tooltip.append('div')
      .attr('class', 'label');

    tooltip.append('div')     
      .attr('class', 'count');

    tooltip.append('div')     
      .attr('class', 'percent');
    
    path.on('mouseover', function(d) {
      var data = d.data;

      var total = d3.sum(dataset.map(value));

      var percent = Math.round(1000 * d.data.count / total) / 10;
      
      tooltip.select('.label').html(name(data));
      tooltip.select('.count').html(value(data));
      tooltip.select('.percent').html(`${percent}%`);
      tooltip.style('display', 'block');

      var arcOver,
        hasSelected;

      hasSelected = d3.select(this)
        .select(() => this.parentNode)
        .select('.selected')
        .node()

      if(hasSelected) {
        arcOver = d3.arc()
          .innerRadius(selectedOR)
          .outerRadius(hoverOR - 3);
      } else {
        arcOver = d3.arc()
          .innerRadius(selectedOR - 5)
          .outerRadius(hoverOR - 8);
      }

      svg.selectAll('.arc path.hover').remove();
      
      d3.select(this)
        .select(() => this.parentNode)
        .append('path')
        .attr('class', 'hover')
        .attr('d', arcOver)
        .attr('fill', (d, i) => color(name(d.data)))
        .attr('stroke', (d, i) => color(name(d.data)))
        .attr('opacity', .3)
    });

    path.on('click', function(d) {
      var arcSelected = d3.arc()
        .innerRadius(arcOR + 3)
        .outerRadius(selectedOR);

        var arcOver = d3.arc()
          .innerRadius(selectedOR)
          .outerRadius(hoverOR - 3);

      svg.selectAll([
        '.arc path.selected',
        '.arc path.hover'
        ]).remove();
      
      d3.select(this)
        .select(() => this.parentNode)
        .append('path')
        .attr('class', 'selected')
        .attr('d', arcSelected)
        .attr('fill', (d, i) => color(name(d.data)))
        .attr('stroke', (d, i) => color(name(d.data)))
        .select(() => this.parentNode)
        .append('path')
        .attr('class', 'hover')
        .attr('d', arcOver)
        .attr('fill', (d, i) => color(name(d.data)))
        .attr('stroke', (d, i) => color(name(d.data)))
        .attr('opacity', .3)
    })

    path.on('mouseout', (d) => {
      tooltip.style('display', 'none');
      svg.selectAll('.arc path.hover').remove();
    });

    path.on('mousemove', (d) => {
      tooltip.style('top', `${d3.event.layerY + 10}px`)
        .style('left', `${d3.event.layerX + 10}px`);
    });

    path.transition()
      .duration(1000)
      .attrTween('d', (d) => {
          var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
          return (t) => arc(interpolate(t));
      });
  }

  render() {
    const {title, id} = this.props 

    return (
      <div 
        id={`${id}--piechart`}
        className='d3-pie-chart'
      >
        {title && <h1>{title}</h1>}
        <div className='pie'></div>
        <div className='legend'></div>
      </div>
    );
  }
}

SPSPieChart.defaultProps = {
  donutWidth: 50,
  value: (d) => {},
  name: (d) => {},
  title: ''
}

SPSPieChart.propTypes = {
  id: PropTypes.string.isRequired
}
