import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';

import { summaryDonations } from './helpers';
import Card from './components/Card';

const genImage = (image) => {
  return `images/${image}`;
}

export default connect((state) => state)(
  class App extends Component {
    constructor(props) {
      super();

      this.state = {
        charities: [],
        selectedAmount: 10,
        cards: []
      };
      this.pay = this.pay.bind(this);
    }

    componentDidMount() {
      const self = this;
      fetch('http://localhost:3001/charities')
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
          self.setState({ charities: data })
        });

      fetch('http://localhost:3001/payments')
        .then(function (resp) { return resp.json() })
        .then(function (data) {
          self.props.dispatch({
            type: 'UPDATE_TOTAL_DONATE',
            amount: summaryDonations(data.map((item) => (item.amount))),
          });
        })
    }
    // pay(id, amount, currency) {
    //   console.log(id, amount, currency);
    //   handlePay(id, amount, currency);
    // }
    pay(item, amount) {
      console.log(item, amount);
      handlePay.call(this, item.id, 100, item.currency);
    }
    render() {
      const self = this;
      const cards = this.state.charities.map(function (item, i) {
        const payments = [10, 20, 50, 100, 500].map((amount, j) => (
          <div className="item"> <label key={j}>
            <input
              type="radio"
              name="payment"
              onClick={function () {
                self.setState({ selectedAmount: amount })
              }} /> {amount}
          </label>
          </div >
        ));
        return (
          <Card image={genImage(item.image)}
            title={item.name}
            key={i}
          >
            <div className="payment-info">
              <div className="payment-value">
                {payments}
              </div>
              <button className="btn" onClick={handlePay.call(self, item.id, self.state.selectedAmount, item.currency)}>Pay</button>
            </div>
          </Card>

        );
      });
      console.log(cards);
      const style = {
        color: 'red',
        margin: '1em 0',
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
      };
      const donate = this.props.donate;
      const message = this.props.message;

      return (
        <div>
          <div className="info">
            <h1>Tamboon React</h1>
            <p>All donations: {donate}</p>
            <p style={style}>{message}</p>
          </div>
          <div className="flexContainer">
            {cards}
          </div>
        </div>
      );
    }
  }
);

function handlePay(id, amount, currency) {
  const self = this;
  console.log(id, amount, currency);
  return function () {
    fetch('http://localhost:3001/payments', {
      method: 'POST',
      body: `{ "charitiesId": ${id}, "amount": ${amount}, "currency": "${currency}" }`,
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow"
    })
      .then(function (resp) { return resp.json(); })
      .then(function () {
        self.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount,
        });
        self.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: `Thanks for donate ${amount}!`,
        });

        setTimeout(function () {
          self.props.dispatch({
            type: 'UPDATE_MESSAGE',
            message: '',
          });
        }, 2000);
      });
  }
}
