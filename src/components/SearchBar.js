import React, { Component } from 'react'

class SearchBar extends Component {

  state = {
    query: undefined
  }

  handleSubmit(event) {
    event.preventDefault()
  }

  handleSearchChange(event) {
    event.preventDefault()
    if (event.target.value.length < 1) {
      this.setState({ query: null })
    } else {
      this.setState({ query: event.target.value })
    }
  }

  render() {
    return (
      <div className='search'>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            onChange={this.handleSearchChange.bind(this)}
            type="text"
            name="searchQuery"
            placeholder={"Search for Restaurants by Name, Cuisine, Location"}
            value={this.state.value}>
          </input>
        </form>
      </div>
    )
  }

}

export default SearchBar
