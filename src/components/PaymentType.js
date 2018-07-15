import React, { Component } from 'react'
const cuid = require('cuid')

class PaymentType extends Component {

  state = {
    paymentType: undefined
  }

  updateSelectedPayment = (event, paymentType) => {
    if(this.state.paymentType === paymentType) {
      this.setState({paymentType: null})
      this.props.updatePaymentType(null)
    } else {
      this.setState({paymentType: paymentType})
      this.props.updatePaymentType(paymentType)
    }
  }

  makeListOfPayments() {
    let paymentTypes = ["AMEX", "Visa", "Discover", "MasterCard"]
    return (
      <ul>
        {paymentTypes.map(pt => (
          <div
            key={cuid()}
            onClick={(event) => this.updateSelectedPayment(event, pt)}
            className={this.state.paymentType === pt ? "filter-type active shadow" : "filter-type"}
            >
          {pt}
          </div>)
        )}
      </ul>
    )
  }

  render() {
    return (
      <div>
        <div className='title'>{"Payment Type"}</div>
        <div className='cuisine-list' style={{fontSize: '1.75vw'}}>
          {this.makeListOfPayments()}
        </div>
      </div>
    )
  }

}

export default PaymentType
