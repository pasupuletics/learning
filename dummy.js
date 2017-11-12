import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      donutWidth,
      id
    }  = this.props;

    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20b);
    var rootSelector = `#${id}--piechart`;

    var svg = d3.select(`${rootSelector} .pie`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

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
      .attr('fill', function(d, i) {
        return color(d.data.label);
      })
      .attr('class', 'arc-default')
      .each(function(d) { this._current = d; });

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

    var tooltip = d3.select(`#${id}--piechart`)
      .append('div')
      .attr('class', 'tooltip');

    tooltip.append('div')
      .attr('class', 'label');

    tooltip.append('div')     
      .attr('class', 'count');

    tooltip.append('div')     
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
        .attr('fill', (d, i) => color(d.data.label))
        .attr('stroke', (d, i) => color(d.data.label))
        .attr('opacity', .3)
    });

    path.on('click', function(a, b, c) {
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
        .attr('fill', (d, i) => color(d.data.label))
        .attr('stroke', (d, i) => color(d.data.label))
        .select(() => this.parentNode)
        .append('path')
        .attr('class', 'hover')
        .attr('d', arcOver)
        .attr('fill', (d, i) => color(d.data.label))
        .attr('stroke', (d, i) => color(d.data.label))
        .attr('opacity', .3)
    })

    path.on('mouseout', function() {
      tooltip.style('display', 'none');
      svg.selectAll('.arc path.hover').remove();
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
    const {title, id} = this.props 

    return (
      <div 
        id={`${id}--piechart`}
        className='d3-pie-chart'
      >
        {title && <h1>{title}</h1>}
        <div className="pie"></div>
        <div className="legend"></div>
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

Pie.propTypes = {
  id: PropTypes.string.isRequired
}


      .d3-pie-chart {
        display: inline-block;
      }

      .d3-pie-chart .tooltip {
        background: #eee;
        box-shadow: 0 0 5px #999999;
        color: #333;
        display: none;
        font-size: 12px;
        left: 130px;
        padding: 10px;
        position: absolute;
        text-align: center;
        top: 95px;
        width: 80px;
        z-index: 10;
      }
      .d3-pie-chart .legend {
        font-size: 12px;
      }

      .d3-pie-chart .pie,
      .d3-pie-chart .legend {
        display: inline-block;
      }
      
      .d3-pie-chart h1 {
        font-size: 14px;
      }
