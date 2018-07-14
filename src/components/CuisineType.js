import React, { Component } from 'react'
const cuid = require('cuid');

class CuisineType extends Component {

  state = {
    cuisine: undefined
  }

  updateSelectedCuisine = (event, cuisine) => {
    if (this.state.cuisine === cuisine.name) {
      this.setState({cuisine: null})
      this.props.updateCuisine(null)
    } else {
      this.setState({cuisine: cuisine.name})
      this.props.updateCuisine(cuisine)
    }
  }

  makeListOfCuisines() {
    let cuisines = this.props.cuisines.slice(0, 7)
    return cuisines.map(cuisine => {
      return (
        <div
          key={cuid()}
          className={this.state.cuisine === cuisine.name ? "flex-column cursor filter-type active shadow" : "flex-column cursor filter-type"}
          onClick={(event) => this.updateSelectedCuisine(event, cuisine)}
          >
          <div key={cuid()} className='cuisine-name'>{cuisine.name}</div>
          <div key={cuid()} className="flex-column cursor filter-type light-text">{cuisine.count}</div>
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        <div className='title'>{"Cuisine/Food Type"}</div>
        <div className='flex-column' style={{fontSize: '1.75rem'}}>
          {this.makeListOfCuisines()}
        </div>
      </div>
    )
  }

}

export default CuisineType
