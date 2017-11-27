import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './TypeAhead.css';
import axios from 'axios';

const CancelToken = axios.CancelToken;
const initialState = {
	isOpen: false,
	queryString: '',
	isFetching: false,
	dataSource: [],
	isError: false
};

export default class TypeAhead extends Component {
	constructor(props) {
		super(props);

		this.state = initialState;
		this.cancelTocken = null;

		this.handlerInputKeyUp = this.handlerInputKeyUp.bind(this);
		this.handlerClearBtnClick = this.handlerClearBtnClick.bind(this);
		this.handlerClickOutside = this.handlerClickOutside.bind(this);
	}
	componentDidMount() {
		this.rootEl = ReactDOM.findDOMNode(this);
		document.addEventListener('mousedown', this.handlerClickOutside)
	}

	componentWillUnmount() {
        document.removeEventListener('mousedown', this.handlerClickOutside);
    }

	componentDidUpdate() {
		const {width} = this.rootEl.getBoundingClientRect();

		if(this.listEl) {
			this.listEl.style.width = `${width}px`;
		} 
	}

	handlerClickOutside(e) {
		const {isOpen} = this.state;

		if (isOpen && !this.rootEl.contains(e.target)) {
            this.setState(initialState)
        }
	}

	handlerClearBtnClick() {
		this.queryInput.value = '';
		this.queryInput.focus();
		this.setState(initialState)
		this.props.onReset();
	}

	handlerInputKeyUp(e) {
		const re = /[0-9a-zA-Z]+/g;
/*		const keyCode = e.keyCode || e.which;
		const keyValue = String.fromCharCode(keyCode);
		console.log(e.key)
*/		
		if (re.test(e.key)) {
			const val = this.queryInput.value;
			const len = val.length;

			this.setState({
				queryString: val,
				isOpen: !!len,
				isFetching: len > 0,
				isError: false
			});

			if(this.cancelTocken) {
				this.cancelTocken('Operation canceled by the user.');
				this.cancelTocken = null;
			}

			this.fetchData(this.props.dataSourceUrl)
	    }

	}

	handlerItemClick(id) {
		const {idKey, labelKey} = this.props;
		const {dataSource} = this.state;
		const selectedItem = (dataSource.filter((o) => o[idKey] === id))[0];
		const queryString = selectedItem[labelKey];

		this.setState({
			isOpen: false,
			queryString
		});

		this.queryInput.value = queryString;
		this.props.onSelect(selectedItem);
	}

	fetchData(url) {
		axios.get(url, {
			cancelToken: new CancelToken((c) => {
				this.cancelTocken = c;
			})
		})
		.then((res) => {
			this.setState({
				dataSource: res.data,
				isFetching: false
			});
		})
		.catch((error) => {
			if(axios.isCancel(error)) {
				console.log('Request canceled', error.message)
			} else {
				this.setState({
					isError: true
				});
			}
		});
	}

	selectItem(id) {

	}

	renderInput() {
		const {className} = this.props;
		const classes = `input-text ${className}`;
		return (
			<input 
				className={classes}
				onKeyUp={this.handlerInputKeyUp}
				ref={(input)=>{this.queryInput = input}}
				placeholder={this.props.placeholder}
			/>
		);
	}

	renderLoading() {
		const {isError} = this.state;
		return (
			<div className="loading-container">
				<span>
					{isError ? 'No records found':'Loading...'}
				</span>
			</div>
		);
	}

	renderMenuList() {
		const { dataSource } = this.state;
		const { idKey:id, labelKey:label } = this.props;

		return (
			<ul className="typeahead-list-container">
			{ 
				dataSource.map(
					o => <li
								onClick={this.handlerItemClick.bind(this, o[id])} 
								className="typeahead-list-item"
								key={o[id]}
							>
								{o[label]}
							</li>
					)
			}
			</ul>
		);
	}

	renderMenu() {
		const {isOpen, isFetching} = this.state;
		let menuTmpl;
		
		if(isOpen) {
			menuTmpl = isFetching? this.renderLoading() : this.renderMenuList();
		}

		return (
			<div className="typeahead-list" ref={(el) => {this.listEl = el;}}>
				{menuTmpl}
			</div>
		)
	}

	render() {
		const { isOpen, queryString } = this.state;
		let enableClearBtn = !!queryString.length;

		return (
			<div className="widget-typeahead">
				<span className="magnifier-icon glyphicon glyphicon-search"></span>
				{this.renderInput()}
				{isOpen && this.renderMenu()}
				{enableClearBtn && 
					<span 
						className="clear-icon glyphicon glyphicon-remove"
						onClick={this.handlerClearBtnClick}
					></span>
				}
			</div>
		);
	}
}

TypeAhead.propTypes = {
	dataSourceUrl: PropTypes.string.isRequired,
	onSelect: PropTypes.func,
	onReset: PropTypes.func,
	idKey: PropTypes.string,
	labelKey: PropTypes.string.isRequired
}

TypeAhead.defaultProps = {
	onSelect: () => {},
	onReset: () => {},
	idKey: 'id',
	placeholder: 'Search...'
}



CSS----------------

.widget-typeahead {
	position: relative;
}

.widget-typeahead .input-text {
	border: 1px solid #DDD;
	border-radius: 3px;
	padding: 5px 28px;
}

.widget-typeahead .typeahead-list {
	position: fixed;
	border: 1px solid #DDD;
	border-radius: 3px;
	max-height: 300px;
	overflow-y: auto;
}

.widget-typeahead .magnifier-icon,
.widget-typeahead .clear-icon {
	position: absolute;
	color: #a5a49e;
}

.widget-typeahead .magnifier-icon {
	top: 9px;
	left: 6px;
}

.widget-typeahead .clear-icon {
	top: 9px;
	right: 10px;
	cursor: pointer;
}
.widget-typeahead .typeahead-list .typeahead-list-container {
	margin: 0;
	padding: 0;
}
.widget-typeahead .typeahead-list .typeahead-list-item{
	list-style-type: none;
	cursor: pointer;
	border-bottom: 1px solid #DDD;
	padding: 5px 5px 5px 28px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.widget-typeahead .typeahead-list .typeahead-list-item::last-child{
	border: none;
}

//Layout--------------

import React, { Component } from 'react';
import { TypeAhead } from '../components';

export default class AccountList extends Component {
	constructor(props) {
		super(props);
		this.onSelect = this.onSelect.bind(this);
		this.onReset = this.onReset.bind(this);
		this.handlerClientListBtnClick = this.handlerClientListBtnClick.bind(this);
	}

	onSelect(val) {
		console.log(val);
	}

	onReset() {
		console.log('------------------RESET');
	}

	handlerClientListBtnClick() {

	}

	render() {
		return (
			<div className="container-fluid">
				<h2>Account List</h2>
				<hr />
				<label>Select a client</label>
				<div className="row">
					<div className="col-xs-5">
						<TypeAhead 
							id="exampleInputEmail3"
							className="form-control"
							dataSourceUrl = "http://jsonplaceholder.typicode.com/posts"
							onSelect={this.onSelect}
							onReset={this.onReset}
							idKey="id"
							labelKey="body"
						/>
					</div>
					<div className="col-xs-1">
					</div>
					<div className="col-xs-6">
						<button 
							className="btn btn-primary"
							onClick={this.handlerClientListBtnClick}
						>
							Client List
						</button>
					</div>
				</div>
				<div className="row" id="accountListFooter">
					<div className="col-xs-12">
						<button
							className="btn btn-primary pull-right"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		);
	}
}
