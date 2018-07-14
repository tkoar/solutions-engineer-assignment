import React, { Component } from 'react'
import CuisineType from '../components/CuisineType'
class SideBar extends Component {

  render() {
    return (
      <div className='sidebar' >
        <CuisineType cuisines={this.props.cuisines} updateCuisine={this.props.updateCuisine}/>
      </div>
    )
  }

}

export default SideBar
