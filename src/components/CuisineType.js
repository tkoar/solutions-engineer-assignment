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

  makeListOfCuisines = () => {
    const cuisines = this.props.cuisines.slice(0, 7)
    let classList = "flex-spacebetween filter-type"
    return cuisines.map(cuisine => {
      if (this.state.cuisine === cuisine.name)
        classList += ' active'
      return (
        <div
          key={cuid()}
          className={classList}
          onClick={(event) => this.updateSelectedCuisine(event, cuisine)}
          >
          <div
            key={cuid()}
            >{cuisine.name}
          </div>
          <div
            className="light-text"
            key={cuid()}
            >{cuisine.count}
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="container">
        <div className='title'>{"Cuisine | Food Type"}</div>
        <div className='container'>
          {this.makeListOfCuisines()}
        </div>
      </div>
    )
  }

}

export default CuisineType
