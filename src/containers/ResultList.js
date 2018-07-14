import React, { Component } from 'react'
import Result from '../components/Result'
const cuid = require('cuid');

class ResultsList extends Component {

  makeResults() {
    return this.props.results.map((result, index) => {
      return <Result key={cuid()} {...result}/>
    })
  }

  render() {
    return (
      <div className='result-list'>
        {this.makeResults()}
      </div>
    )
  }

}

export default ResultsList
