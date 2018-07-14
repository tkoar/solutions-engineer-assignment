import React, { Component } from 'react'
import CuisineType from '../components/CuisineType'
class SideBar extends Component {

  render() {
    return (
      <div>
        <CuisineType cuisines={this.props.cuisines}/>
      </div>
    )
  }

}

export default SideBar
