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

  render() {
    console.log(this.props.results);
    return (
      <div className='result-list'>
        {this.makeResults()}
        {this.showButton()}
      </div>
    )
  }

}

export default ResultsList
