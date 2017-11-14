import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Pie from './NewPie.jsx';
import SPSPieChart from './SPSPieChart.jsx';
import * as d3 from 'd3';
import './testbed.css';
/**
 * Your imports here. For example:
 *
 * import 'some-lib/lib/Typography/Typography.css';
 * import {Button, BadgeButton} from 'some-lib';
 *
 */

class App extends Component {
  componentDidMount() {
    // App is ready, show the page
    document.body.classList.remove('tb-hidden');
  }

  _value(d) {
    return d.count;
  }
  _name(d) {
    return d.label;
  }
  _mappedObject(g) {
    return Object.create({ label: g.key, count: g.value })
  }

  render() {
    var dataset = [
      { label: 'Abulia', count: 10, test: 'TEST' },
      { label: 'Betelgeuse', count: 20, test: 'TEST' },
      { label: 'Cantaloupe', count: 30, test: 'TEST' },
      { label: 'Dijkstra', count: 40, test: 'TEST' },
      { label: 'Abulia', count: 10, test: 'TEST' },
      { label: 'Betelgeuse', count: 20, test: 'TEST' },
      { label: 'Cantaloupe', count: 30, test: 'TEST' },
      { label: 'Dijkstra', count: 40, test: 'TEST' },
      { label: 'Abulia', count: 10, test: 'TEST' },
      { label: 'Betelgeuse', count: 20, test: 'TEST' },
      { label: 'Cantaloupe', count: 30, test: 'TEST' },
      { label: 'Dijkstra', count: 40, test: 'TEST' },
      { label: 'Abulia', count: 10, test: 'TEST' },
      { label: 'Betelgeuse', count: 20, test: 'TEST' },
      { label: 'Cantaloupe', count: 30, test: 'TEST' },
      { label: 'Dijkstra', count: 40, test: 'TEST' },
      { label: 'Abulia', count: 10, test: 'TEST' },
      { label: 'Betelgeuse', count: 20, test: 'TEST' },
      { label: 'Cantaloupe', count: 30, test: 'TEST' },
      { label: 'Dijkstra', count: 40, test: 'TEST' },
      { label: 'Abulia', count: 10, test: 'TEST' },
      { label: 'Betelgeuse', count: 20, test: 'TEST' },
      { label: 'Cantaloupe', count: 30, test: 'TEST' },
      { label: 'Dijkstra', count: 40, test: 'TEST' },
      { label: 'Hello', count: 1000, test: 'TEST' }
    ];

    const hoverChart = () => {
      return (
        <SPSPieChart
          data= {dataset}
          width= {150}
          height= {150}
          value= {this._value}
          name= {this._name}
          id= 'hover-donut-one'
          mappedObject={this._mappedObject}
          enableLegend={false}
        />
      );      
    }

    return (
      <div>
        <HoverPopup
          hoverContent={hoverChart}
        >
          <table>
            <tbody>
            {
              dataset.map((d, i) => 
                <tr key={i} data-index={i} className='row'>
                  <td>{d.label}</td>
                  <td>{d.count}</td>
                  <td>{d.test}</td>
                </tr>
              )
            }
            </tbody>
          </table>
        </HoverPopup>
      </div>
    );
  }
}

class HoverPopup extends Component{
  constructor(props) {
    super(props);
    
    this.state = { 
      x: 0,
      y: 0,
      visible: false
    };

    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this)
  }
  onMouseEnterHandler(e) {
    //console.log(this.hoveredEl);
    this.setState({visible: true});   
  }
  onMouseLeaveHandler() {
    //console.log(this.hoveredEl);
    this.setState({visible: false});   
  }
  onMouseMoveHandler(e) {
    const target = e.target;

    /*if(target.nodeName.toLowerCase() === 'td' && target.parentNode.className.indexOf('row') > -1) {
      console.log(d3.select(target.parentNode));
    }*/

    this.setState({ x: e.pageX + 10, y: e.pageY + 10 });
  }
  render() {
    const {hoverContent:HoverContent} = this.props;
    const {x, y, visible} = this.state;
    const style = {
      position:'absolute',
      top: `${y}px`,
      left: `${x}px`,
      zIndex: 9999,
      display: visible? 'inline-block' : 'none'
    };

    return (
      <div 
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
        onMouseMove={this.onMouseMoveHandler}
        className='widget-hover-popup'
      >
        <div
          className='hover-popup-container' 
          style={style}
          ref={(hoveredEl)=> {this.hoveredEl = hoveredEl}}
        >
          <HoverContent />
        </div>
        {React.cloneElement(this.props.children, [...this.props])}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));


---------------------------
        .widget-hover-popup {
        display: inline-block;
      }
      .widget-hover-popup .hover-popup-container {
        background: #FFF;
        border: 1px solid #DDD;
        border-radius: 7px;
        -webkit-box-shadow: 0px 0px 25px 1px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 25px 1px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 25px 1px rgba(0,0,0,0.75);
      }
