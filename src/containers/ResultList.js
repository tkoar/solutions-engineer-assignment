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
      <div>
        <div>
          {this.makeResults()}
        </div>
      </div>
    )
  }

}

export default ResultsList
