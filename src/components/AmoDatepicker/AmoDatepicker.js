import React from 'react';
import { CDate } from './CDate';

import './AmoCalendar.css';
import AmoCalendar from './AmoCalendar';

class AmoDatepicker extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      model: '',
      modelDate: null
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  toggleOpen() {
    var isOpen = !this.state.isOpen;
    this.setState({ isOpen });
  }
  
  render() {
    return <div className="amo-datepicker">
      <div className="form-group">
        <input type="text" className="form-control" value={this.state.model} onChange={this.inputModelChange.bind(this)} />
        <label onClick={this.toggleOpen.bind(this)}>開關</label>
      </div>
      {this.state.isOpen? (
        <AmoCalendar model={this.state.modelDate} sendModel={this.calendarModelChange.bind(this)} />
      ) : ''}
    </div>
  }

  inputModelChange(event) {
    var model = event.target.value;
    var modelDate = CDate.String2Date(model, '-');
    // console.log(model, modelDate);
    this.setState({ model, modelDate });
  }
  
  calendarModelChange(event) {
    var model = CDate.yyyymmdd(event, '-');
    var modelDate = event;
    var isOpen = false;
    // console.log(model, isOpen);
    this.setState({ model, modelDate, isOpen });
  }
}
export default AmoDatepicker;