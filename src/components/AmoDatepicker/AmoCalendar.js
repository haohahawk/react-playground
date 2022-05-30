import React from 'react';
import classNames from 'classnames';
import { CDate } from './CDate';

import AmoCalendarCell from './AmoCalendarCell';

class AmoCalendar extends React.Component {

  get title() {
    const index = this.state.viewTypes.indexOf(this.state.viewType);
    const viewValue = this.state.viewValue;
    if(index === 0) {
      let firstYear = this.get1stYearOfYearsCalendar(viewValue).getFullYear();
      return `${firstYear} ~ ${firstYear + 10}`;
    }
    if(index === 1) { return `${viewValue.getFullYear()} ▴`; }
    if(index === 2) { return `${viewValue.getFullYear()} - ${viewValue.getMonth() + 1} ▴`; }
  }

  get cells() {
    const index = this.state.viewTypes.indexOf(this.state.viewType);
    if(index === 0) { return this.getYearsCalendar(); }
    if(index === 1) { return this.getYearCalendar(); }
    if(index === 2) { return this.getMonthCalendar(); }
  }

  get rootCssClass() {
    const index = this.state.viewTypes.indexOf(this.state.viewType);
    return classNames({
      'amo-c': true,
      'is-years': index === 0,
      'is-year': index === 1,
      'is-month': index === 2
    });
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    var viewTypes = ['years', 'year', 'month'];
    var viewType = viewTypes[viewTypes.length - 1];
    var viewValue = CDate.getDate(new Date());
    var selectedValue = null;
    var propsModel = this.props.model;
    if (propsModel instanceof Date) {
      viewValue = propsModel;
      selectedValue = propsModel;
    }
    this.setState({
      viewTypes,
      viewType,
      viewValue, 
      selectedValue 
    });
  }

  componentWillReceiveProps(nextProps) {
    var selectedValue = nextProps.model;
    if (selectedValue instanceof Date) {
      this.setState({ selectedValue });
    }
    // console.log(nextProps);
  }

  render() {
    const state = this.state;
    var week = ['日', '一', '二', '三', '四', '五', '六'].map((day, index) => {
      return <div key={'w'+index} className="amo-c-week-cell">{day}</div>;
    });
    var isViewMonth = state.viewTypes[2] === state.viewType;
    var cells = this.cells.map((date, index) => {
      return <AmoCalendarCell key={'d'+index} value={date} config={state} go={this.zoomIn.bind(this)} />;
    });
    return (
      <div className={this.rootCssClass}>
        <div className="amo-c-head">
          <div className="btn amo-c-title" onClick={() => this.zoomOut()}>{this.title}</div>
          <div className="btn btn-round" onClick={() => this.previous()}>◂</div>
          <div className="btn btn-round" onClick={() => this.next()}>▸</div>
        </div>
        <div className="amo-c-body">
          {isViewMonth? <div className="amo-c-container amo-c-week">{week}</div> : ''}
          <div className="amo-c-container">
            {cells}
          </div>
        </div>
      </div>
    )
  }

  ////////// Handle Event

  zoomIn(date) {
    const index = this.state.viewTypes.indexOf(this.state.viewType);
    const state = {};
    if(index < this.state.viewTypes.length - 1) {
      state.viewValue = date;
    } else {
      state.selectedValue = date;
      this.props.sendModel(date);
    }
    // console.log(date);
    this.setState(state);
    this.zoomViewTypes(1);
  }
  
  zoomOut() {
    this.zoomViewTypes(-1);
  }

  zoomViewTypes(offset) {
    const state = this.state;
    const index = state.viewTypes.indexOf(state.viewType) + offset;
    if(index >= 0 && index <= state.viewTypes.length - 1) {
      this.setState({
        viewType: state.viewTypes[index]
      });
    }
    // console.log(index + offset, state);
  }

  next() {
    this.moveViewValue(1);
  }

  previous() {
    this.moveViewValue(-1);
  }
  
  moveViewValue(offset) {
    var viewValue = this.state.viewValue;
    const index = this.state.viewTypes.indexOf(this.state.viewType);
    if(index === 0) { viewValue = CDate.offsetYear(viewValue, offset * 10) }
    if(index === 1) { viewValue = CDate.offsetYear(viewValue, offset) }
    if(index === 2) { viewValue = CDate.offsetMonth(viewValue, offset) }
    this.setState({
      viewValue: viewValue
    });
  }


  ////////// Handle Calendar

  // 取得多年曆
  getYearsCalendar() {
    const state = this.state;
    var calen1stYear = this.get1stYearOfYearsCalendar(state.viewValue);
    var years = [];
    for (var i = 0; i < 10; i++) {
      let y = CDate.offsetYear(calen1stYear, i);
      years.push(y);
    }
    return years;
  }

  // 取得多年曆 - 第 1 年, 以 10 年為一組, e.g.2001 ~ 2010
  get1stYearOfYearsCalendar(date) {
    if (date instanceof Date === false) return;
    var currentYYYY = date.getFullYear();
    var yyyy = Math.floor((currentYYYY - 1) / 10) * 10 + 1;
    // 差距幾年 = 當年 - 當組第1年
    var offset = yyyy - currentYYYY;
    // console.log(offset, yyyy, currentYYYY);
    var the1stYear = CDate.offsetYear(date, offset);
    return the1stYear;
  }

  // 取得年曆
  getYearCalendar() {
    const state = this.state;
    var calen1stMonth = CDate.firstMonth(state.viewValue);
    var months = [];
    for (var i = 0; i < 12; i++) {
      let m = CDate.offsetMonth(calen1stMonth, i);
      months.push(m);
    }
    return months;
  }
  
  // 取得月曆
  getMonthCalendar() {
    const state = this.state;
    var days = [];
    var calen1stDate = this.get1stDateOfMonthCalendar(state.viewValue);
    for (var i = 0; i < 42; i++) {
      let d = CDate.offsetDate(calen1stDate, i);
      days.push(d);
    }
    return days;
  }
  
  // 取得月曆 - 第 1 天
  get1stDateOfMonthCalendar(date) {
    if (date instanceof Date === false) return;
    // 當月1號 - 月曆上的第1天 = 差距幾天
    var firstDate = CDate.firstDate(date);
    var offsetDay = firstDate.getDay();
    var the1stDate = CDate.offsetDate(firstDate, -offsetDay);
    return the1stDate;
  }
  
  // 取得年曆 - 第 1 月
  get1stMonthOfYearCalendar(date) {
    if (date instanceof Date === false) return;
    var firstMonth = CDate.firstMonth(date);
    return firstMonth;
  }
}
export default AmoCalendar;