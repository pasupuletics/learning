import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Pie extends Component {
  componentDidMount() {
    this._renderPie();
  }

  _renderPie() {
    const {
      data:dataset,
      width,
      height,
      value,
      donutWidth
    }  = this.props;

    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    var svg = d3.select('#pie')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

    var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius- 10);

    var arcOver = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius - 7);

    var pie = d3.pie()
      .value(value)
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.label);
      })
      .each(function(d) { this._current = d; });

    var legendRectSize = 18;
    var legendSpacing = 4;

    var svgLegend = d3.select('#legend-root')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
    
    var legend = svgLegend.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
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
      .text(function(d) { return d; });

    var tooltip = d3.select('#chart')            // NEW
      .append('div')                             // NEW
      .attr('class', 'tooltip');

    tooltip.append('div')                        // NEW
      .attr('class', 'label');                   // NEW

    tooltip.append('div')                        // NEW
      .attr('class', 'count');                   // NEW

    tooltip.append('div')                        // NEW
      .attr('class', 'percent');
    
    path.on('mouseover', function(d) {
      var total = d3.sum(dataset.map(function(d) {
        return d.count;
      }));

      var percent = Math.round(1000 * d.data.count / total) / 10;
      
      tooltip.select('.label').html(d.data.label);
      tooltip.select('.count').html(d.data.count);
      tooltip.select('.percent').html(percent + '%');
      tooltip.style('display', 'block');

      path = path.data(pie(dataset));
      d3.select(this).transition()
        .duration(300)
        .attr("d", arcOver);
    });

    path.on('mouseout', function() {
      tooltip.style('display', 'none');

      d3.select(this).transition()
        .duration(1000)
        .attr("d", arc);
    });

    path.on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX + 10) + 'px');
    });

    path.transition()
        .duration(1000)
        .attrTween('d', function(d) {
            var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
            return function(t) {
                return arc(interpolate(t));
            };
        });

  }
  render() {
    const title = this.props.title 

    return (
      <div id="chart">
        {title && <h1>{title}</h1>}
        <div id="pie"></div>
        <div id="legend-root"></div>
      </div>
    );
  }
}

Pie.defaultProps = {
  donutWidth: 50,
  value: (d) => {},
  name: (d) => {},
  title: ''
}
