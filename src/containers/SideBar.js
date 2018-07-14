import React, { Component } from 'react'
import CuisineType from '../components/CuisineType'
import Rating from '../components/Rating'
class SideBar extends Component {

  render() {
    return (
      <div className='sidebar' >
        <CuisineType cuisines={this.props.cuisines} updateCuisine={this.props.updateCuisine}/>
        <Rating updateBasedOnRating={this.props.updateBasedOnRating}/>
      </div>
    )
  }

}

export default SideBar
