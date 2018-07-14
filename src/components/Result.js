import React, { Component } from 'react'
import GoldStar from './../resources/graphics/stars-plain.png'
import EmptyStar from './../resources/graphics/star-empty.png'
const cuid = require('cuid');

class Result extends Component {

  addFullStars(num) {
    let stars = []
    for (var i = 0; i < num; i++) {
      stars.push(<img key={cuid()} src={GoldStar} className='star' alt={"gold-star"}></img>)
    }
    return stars
  }

  addEmptyStars(num) {
    let stars = []
    for (var i = 0; i < num; i++) {
      stars.push(<img key={cuid()} src={EmptyStar} className='star' alt={"empty-star"}></img>)
    }
    return stars
  }

  makeStars() {
    let num_stars = Math.round(parseFloat(this.props.stars_count))
    let full_stars = this.addFullStars(num_stars)
    let empty_stars = this.addEmptyStars(5-num_stars)
    return [...full_stars, ...empty_stars]
  }

  render() {
    return (
      <div className='result'>
        <div className='img-container'><img className="result-img shadow" src={this.props.image_url} alt={this.props.name}></img></div>
        <div className='result-rating'>
          <div className='result-title'>{this.props.name}</div>
          <div className='result-stars-count'>
            {this.props.stars_count}
            <div className='star-container'>{this.makeStars()}</div>
            <div className='light-text'>{`(${this.props.reviews_count} reviews)`}</div>
          </div>
          <div className='light-text result-description'>
            {`${this.props.food_type} | ${this.props.area} | ${this.props.price_range}`}
          </div>
        </div>
      </div>
    )
  }

}

export default Result
