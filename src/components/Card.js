import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPayment: false,
      paymentClass: "payment"
    }
    this.payment = this.payment.bind(this);
    this.cancel = this.cancel.bind(this);

  }
  payment() {
    this.setState({ isPayment: true, paymentClass: "payment animated fadeInUp delay-0.5s" });
  }
  cancel() {
    this.setState({ paymentClass: "payment animated fadeOutDown" });
  }
  render() {
    const { image, title } = this.props;
    const self = this;
    return (
      <div className="card">
        <button className="content" tabindex="0" type="button">
          <div className="image" style={{ backgroundImage: 'url(' + image + ')' }} title="Contemplative Reptile"></div>
          <div className="title-info">
            <div className="title">
              <p >{title}</p>
            </div>
            <div className="action">
              <button className="btn" onClick={this.payment}>Donate</button>
            </div>
          </div>
        </button>
        <div className={this.state.paymentClass} style={this.state.isPayment === true ? { display: "flex" } : { display: "none" }}>
          <div className="cancel-icon" onClick={this.cancel} style={{ backgroundImage: 'url("images/icon-x.png")' }}></div>
          {this.props.children}
        </div>
      </div >
    )
  }
}
function mapStateToProps(state) {
  return {
  };
}
export default connect(mapStateToProps)(Card);