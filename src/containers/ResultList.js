import React, { Component } from 'react'
import Result from '../components/Result'
const cuid = require('cuid');

class ResultsList extends Component {

  makeResults() {
    return this.props.results.map((result, index) => {
      return <Result key={cuid()} {...result}/>
    })
  }

  showNextPage = (event) => {
    this.props.updatePageNumber()
  }

  showButton = () => {
    if (this.props.results.length < 1) {
      return (<div className='loader'></div>)
    } else {
      return (
        <button
          onClick={(event) => this.showNextPage(event)}
          >
            {"Show More Results"}
        </button>
      )
    }
  }

  showSearchStats = () => {
    if (this.props.searchCount) {
      return(
        <div className="result-stats">
          <span className="search-count">{`${this.props.searchCount} results found `}</span>
          <span className="search-time">{` in ${this.props.searchTime/1000} seconds.`}</span>
        </div>
      )
    }
  }

  render() {
    return (
      <div className='result-list'>
        <div>{this.showSearchStats()}</div>
        {this.makeResults()}
        {this.showButton()}
      </div>
    )
  }

}

export default ResultsList
