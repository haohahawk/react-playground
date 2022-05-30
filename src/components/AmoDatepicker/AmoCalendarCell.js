import React from 'react';
import classNames from 'classnames';
import { CDate } from './CDate';

class AmoCalendarCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.getValue(props),
      btnClass: this.getBtnCssClass(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  render() {
    return <div className={this.state.btnClass} onClick={() => this.send()}>
      <div className="amo-c-btn btn-round">{this.state.value}</div>
    </div>
  }

  updateState(props) {
    this.setState({
      value: this.getValue(props),
      btnClass: this.getBtnCssClass(props)
    });
  }

  send() {
    this.props.go(this.props.value);
  }

  getValue(props) {
    const config = props.config;
    const value = props.value;
    const index = config.viewTypes.indexOf(config.viewType);
    if (index === 0) {
      return value.getFullYear();
    }
    if (index === 1) {
      return value.getMonth() + 1 + '月';
    }
    if (index === 2) {
      return value.getDate();
    }
  }

  getBtnCssClass(props) {
    const config = props.config;
    const value = CDate.yyyymmdd(props.value);
    const todayValue = CDate.yyyymmdd(new Date());
    const selectedValue = CDate.yyyymmdd(config.selectedValue);
    const index = config.viewTypes.indexOf(config.viewType);
    const subStrEnd = (2 + index) * 2;
    var isOnDate, isSelected, isntInMonth;
    if (index === 2) {
      isntInMonth = value.substr(0, 6) !== CDate.yyyymmdd(config.viewValue).substr(0, 6);
    }
    isOnDate = value.substr(0, subStrEnd) === todayValue.substr(0, subStrEnd);
    isSelected = value.substr(0, subStrEnd) === selectedValue.substr(0, subStrEnd);
    var dateClass = { 'is-on-date': isOnDate, 'is-selected': isSelected, 'is-invisible': isntInMonth };
    return classNames('amo-c-cell', dateClass);
  }
}
export default AmoCalendarCell;