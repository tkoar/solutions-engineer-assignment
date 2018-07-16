import React, { Component } from 'react'
import GoldStar from './../resources/graphics/stars-plain.png'
import EmptyStar from './../resources/graphics/star-empty.png'
const cuid = require('cuid')

class Rating extends Component {

  state = {
    rating: undefined
  }

  addFullStars(num, spinning) {
    let classList = spinning ? 'star rating-selected' : 'star'
    let stars = []
    for (var i = 0; i < num; i++) {
      stars.push(<img key={cuid()} alt={"gold star"} src={GoldStar} className={classList}></img>)
    }
    return stars
  }

  addEmptyStars(num, spinning) {
    let classList = spinning ? 'star rating-selected' : 'star'
    let stars = []
    for (var i = 0; i < num; i++) {
      stars.push(<img key={cuid()} alt={"empty star"} src={EmptyStar} className={classList}></img>)
    }
    return stars
  }

  makeStars() {
    let stars = []
    for (let num_stars = 0; num_stars < 6; num_stars++) {
      let spinningStars = this.state.rating === num_stars ? 'rating-selected' : false
      let full_stars = this.addFullStars(num_stars, spinningStars)
      let empty_stars = this.addEmptyStars(5-num_stars, spinningStars)
      let classList = 'flex-row container rating'
      stars.push(
        <div
          key={cuid()}
          className={classList}
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
      <div className='container'>
        <div className='title'>{"Rating"}</div>
        {this.makeStars()}
      </div>
    )
  }

}

export default Rating
