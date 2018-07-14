import React, { Component } from 'react'
import GoldStar from './../resources/graphics/stars-plain.png'
import EmptyStar from './../resources/graphics/star-empty.png'
const cuid = require('cuid');

class Rating extends Component {

  state = {
    rating: undefined
  }

  addFullStars(num) {
    let stars = []
    for (var i = 0; i < num; i++) {
      stars.push(<img key={cuid()} alt={"gold star"} src={GoldStar} className='star'></img>)
    }
    return stars
  }

  addEmptyStars(num) {
    let stars = []
    for (var i = 0; i < num; i++) {
      stars.push(<img key={cuid()} alt={"empty star"} src={EmptyStar} className='star'></img>)
    }
    return stars
  }

  makeStars() {
    let stars = []
    for (let num_stars = 0; num_stars < 6; num_stars++) {
      let full_stars = this.addFullStars(num_stars)
      let empty_stars = this.addEmptyStars(5-num_stars)
      stars.push(
        <div
          key={cuid()}
          className={this.state.rating === num_stars ? 'star-line active shadow' : 'star-line'}
          onClick={(event) => this.updateRating(event, num_stars)}
          data-rating={num_stars}>{[...full_stars, ...empty_stars]}
        </div>
      )
    }
    return stars
  }

  updateRating = (event, num_stars) => {
    if (this.state.rating === num_stars) {
      this.setState({rating: null})
      this.props.updateBasedOnRating(null)
    } else {
      this.setState({rating: num_stars})
      this.props.updateBasedOnRating(num_stars)
    }
  }

  render() {
    return (
      <div>
        <div className='title'>{"Rating"}</div>
        <br></br>
        <div style={{cursor: 'pointer'}}>{this.makeStars()}</div>
      </div>
    )
  }

}

export default Rating
