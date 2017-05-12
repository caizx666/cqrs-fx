/**
 *
 */
import React from 'react';
import ReactDOM from "react-dom";
import {
  observer
} from "mobx-react";
import BaseComponent from '../tcomponent';
import 'styles';
import {
  Tooltip,
  Radio,
  Checkbox
} from 'antd';

// 过滤项基类
@observer
export default class Filter extends BaseComponent {
  static propTypes = {
    onChanged: React.PropTypes.func,
    onDisableChanged: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onKeyUp: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onRefClick: React.PropTypes.func,

   //例：参照点击后的事件，
   onRefClicked: React.PropTypes.func,

   //例：参照更改前的事件，
   onRefChange:React.PropTypes.func,

   //例：参照更改后的事件
   onRefChanged: React.PropTypes.func,

   //例：参照枚举下拉按钮点击前的事件，
    onRefCboClick: React.PropTypes.func,

   //例：枚举下拉选定后的事件，
   onComboClick: React.PropTypes.func,

   //例：dropdown控件点击前抛出事件，
   beforeDropDown:React.PropTypes.func,

   //例：下拉控件下拉后抛出事件
   afterDropDown: React.PropTypes.func,

    filterClassName: React.PropTypes.string,
    filterControlClass: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.handleBeginValue = this.handleChange('beginValue');
    this.handleEndValue = this.handleChange('endValue');
    this.handleValue = this.handleChange('value');
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleBeginBlur = this.handleBeginBlur.bind(this);
    this.handleEndBlur = this.handleEndBlur.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.formatValue = this.formatValue.bind(this);
    this.handleBeginKeyup = this.handleBeginKeyup.bind(this);
    this.handleGroupKeyUp = this.handleGroupKeyUp.bind(this);
    this.parseValue = this.parseValue.bind(this);
  }

  handleChange = (scope) => (value) => {
    // 如果有错误
    this.props.clearError && this.props.clearError();
    const v = this.parseValue(value);
    if (this.props.onChanged) {
      if (this.props.mode == 'range') {
        this.props.onChanged({
          beginValue: scope == 'beginValue' ? v : this.props.beginValue,
          endValue: scope == 'endValue' ? v : this.props.endValue,
          scope: scope == 'beginValue' ? 0: 1
        });
      } else {
        this.props.onChanged({value:v});
      }
    }
  }

  parseValue(value){
    return {
      value,
      text:value
    };
  }

  handleBeginBlur(event) {
    // 区间自动带值
    if ((!this.props.endValue || !this.props.endValue.value) && this.props.beginValue && this.props.beginValue.value) {
      this.handleEndValue(this.formatValue(this.props.beginValue));
    }
    this.handleBlur();
  }

  handleEndBlur(event) {
    this.handleBlur();
  }

  handleBlur(event) {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    this.setState({
      focus: false
    });
  }

  handleRadioChange(event) {
    if (!event.target.checked){
      // 如果有错误
      this.props.clearError && this.props.clearError();
    }
    this.props.onDisableChanged && this.props.onDisableChanged(!event.target.checked);
  }

  handleCheckChange(event) {
    if (!event.target.checked){
      // 如果有错误
      this.props.clearError && this.props.clearError();
    }
    this.props.onDisableChanged && this.props.onDisableChanged(!event.target.checked);
  }

  formatValue(value, defaultValue) {
    return (value && value.value) || defaultValue;
  }

  handleBeginKeyup(event) {
    if (event.keyCode == 13) {
      const ref = this.refs.end,
        node = ref && ReactDOM.findDOMNode(ref),
        inputs = node && node.getElementsByTagName('input'),
        input = inputs.length > 0 && inputs[0];
      input && input.focus();
    }
  }

  getRef() {
    if (this.props.mode == 'range') {
      return this.refs.begin;
    } else if (this.props.mode == 'multi') {
      return this.refs.multi;
    } else {
      return this.refs.item;
    }
    return null;
  }

  handleGroupKeyUp(event) {
    if (!this.props.disabled) {
      let ref = this.getRef();
      const node = ref && ReactDOM.findDOMNode(ref),
        inputs = node && node.getElementsByTagName('input'),
        input = inputs.length > 0 && inputs[0];
      input && input.focus()
    } else {
      if (this.props.onKeyUp) {
        this.props.onKeyUp(event);
      }
    }
  }

  handleFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.setState({
      focus: true
    });
  }

  filterOptions(options){
    return options;
  }

  renderBeginControl() {
    let BEGINCONTROLTYPE = this.beginControlType || this.controlType;
    let handler = this.beginValueChangeHandler || this.valueChangeHandler;
    return <BEGINCONTROLTYPE ref='begin' {...this.filterOptions(this.props.options, 'begin')}  disabled={this.props.disabled}
                               value={this.formatValue(this.props.beginValue  , this.props.beginDefault)}
                               onBlur={this.handleBeginBlur}
                               onFocus={this.handleFocus}
                               onClick={this.props.onClick}
                               onKeyUp={this.handleBeginKeyup}
                               onChange={handler || this.handleBeginValue}/>;
  }

  renderEndControl() {
    let ENDCONTROLTYPE = this.endControlType || this.controlType;
    let handler = this.endValueChangeHandler || this.valueChangeHandler;
    return <ENDCONTROLTYPE ref='end' {...this.filterOptions(this.props.options, 'end')}  disabled={this.props.disabled}
                            value={this.formatValue(this.props.endValue  , this.props.endDefault)}
                            onBlur={this.handleEndBlur}
                            onFocus={this.handleFocus}
                            onClick={this.props.onClick}
                            onKeyUp={this.props.onKeyUp}
                            onChange={handler || this.handleEndValue}/>;
  }

  renderControl() {
    let BEGINCONTROLTYPE = this.controlType;
    let handler = this.valueChangeHandler;
    return <BEGINCONTROLTYPE ref='item' {...this.filterOptions(this.props.options)}  disabled={this.props.disabled}
                               value={this.formatValue(this.props.value  , this.props.beginDefault)}
                               onBlur={this.handleBlur}
                              onFocus={this.handleFocus}
                               onClick={this.props.onClick}
                               onKeyUp={this.props.onKeyUp}
                               onChange={handler || this.handleEndValue}/>;
  }

  renderMutilControl() {
    let BEGINCONTROLTYPE = this.mutilControlType || this.controlType;
    let handler = this.mutilValueChangeHandler || this.valueChangeHandler;
    return <BEGINCONTROLTYPE ref='mutil' {...this.filterOptions(this.props.options)} disabled={this.props.disabled}
          value={this.formatValue(this.props.value  , this.props.beginDefault)}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onClick={this.props.onClick}
          onKeyUp={this.props.onKeyUp}
          onChange={handler || this.handleValue}/>;
  }

  renderControls() {
    if (this.props.mode == 'range') {
      return (
        <div className='filter-control'  >
          <div className='filter-begin'>
            {this.renderBeginControl()}
          </div>
          <div className="filter-split">-</div>
          <div className='filter-end'>
            {this.renderEndControl()}
          </div>
        </div>
      );
    } else if (this.props.mode == 'multi') {
      return (
        <div className={this.getClasses('filter-control', this.props.filterControlClass)}  >
          {this.renderMutilControl()}
        </div>
      );
    } else {
      return (
        <div className={this.getClasses('filter-control', this.props.filterControlClass)}  >
          {this.renderControl()}
        </div>
      );
    }
  }

  renderRequired(){
    return this.props.required?(<span className='filter-required'>*</span>):null;
  }

  renderLabelText() {
    return (<label className="filter-label" title={   this.props.labelText }>
      { this.renderRequired() }
      { this.props.labelText }
      ：
    </label>);
  }

  renderErrorIcon() {
    let errorIcon = null;
    // 错误提示
    if (this.props.errorItem && this.props.errorItem.error && this.props.errorItem.errorVisible) {
      errorIcon = <span className='label label-danger' onClick={()=>this.props.errorItem.clearError()}>
          <Tooltip title={this.props.errorItem.error} >!</Tooltip>
        </span>;
    }
    return errorIcon;
  }

  renderGroupButton() {
    let groupButton = null;
    // 分组
    if (this.props.group) {
      if (this.props.group.type == 'radio') {
        groupButton = <div className='filter-group' onKeyUp={this.handleGroupKeyUp}>
            <Radio className='group-button' name={this.props.group.code}
                  checked={!this.props.disabled}
                  onChange={this.handleRadioChange}/></div>;
      }
      if (this.props.group.type == 'check') {
        groupButton = <div className='filter-group' onKeyUp={this.handleGroupKeyUp}>
            <Checkbox className='group-button' name={this.props.group.code}
                                checked={!this.props.disabled}
                                onChange={this.handleCheckChange}/></div>;
      }
    }
    return groupButton;
  }

  render() {
    return (
      <div className={this.getClasses('filter', this.props.filterClassName,
       this.state.focus?'filter-focus':null,
       this.props.disabled?'disabled':null)}>
        {this.renderGroupButton()}
        {this.renderLabelText()}
        {this.renderErrorIcon()}
        {this.renderControls()}
      </div>);
  }
}
