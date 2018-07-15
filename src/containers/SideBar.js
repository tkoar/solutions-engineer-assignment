import React, { Component } from 'react'
import CuisineType from '../components/CuisineType'
import Rating from '../components/Rating'
import PaymentType from '../components/PaymentType'
class SideBar extends Component {

  render() {
    return (
      <div className='sidebar' >
        <CuisineType cuisines={this.props.cuisines} updateCuisine={this.props.updateCuisine}/>
        <Rating updateBasedOnRating={this.props.updateBasedOnRating}/>
        <PaymentType updatePaymentType={this.props.updatePaymentType}/>
      </div>
    )
  }

}

export default SideBar
