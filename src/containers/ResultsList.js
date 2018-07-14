import React, { Component } from 'react'
import Result from '../components/Result'

class ResultsList extends Component {

  makeResults() {
    return this.props.results.map((result, index) => {
      return <Result />
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
