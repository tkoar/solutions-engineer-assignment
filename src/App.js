import React, { Component } from 'react'
import SearchBar from './components/SearchBar'
import SideBar from './containers/SideBar'
import ResultList from './containers/ResultList'
import {index, helper} from './resources/SearchTools'
import './App.css'

class App extends Component {

  state = {
    searchQuery: "",
    searchResults: [],
    searchCount: undefined,
    searchTime: undefined,
    cuisineTypes: []
  }

  updateSearchQuery = (searchQuery) => {
    this.setState({searchQuery: searchQuery}, () => this.updateSearch(searchQuery))
  }

  updateStateWithSearchResults = () => {
    helper.on("result", (content) => {
      this.setState({
        searchResults: content.hits,
        searchCount: content.nbHits,
        searchTime: content.processingTimeMS,
        cuisineTypes: content.getFacetValues("food_type"),
      })
    })
  }

  updateSearch = () => {
    helper.setQuery(this.state.searchQuery).search()
    this.updateStateWithSearchResults()
  }

  handleSuccessError = (error, content, action) => {
    if (error) {
      console.log("There was an error " + action + "!", error)
      throw error
    } else {
      console.log("Success " + action + "!", content)
    }
  }

  setIndex() {
    index.setSettings(
      {
        'attributesForFaceting': ['food_type'],
        'sortFacetValuesBy': 'count',
        'searchableAttributes': [
          "name",
          "food_type",
          "city",
          "area",
          "neighborhood"
        ]
      }, (error, content) => this.handleSuccessError(error, content, "setting index settings")
    )
  }

  componentDidMount() {
    this.setIndex()
    helper.search(this.state.searchQuery)
    this.updateStateWithSearchResults()
  }


  render() {
    return (
      <div className="App flex-row">
        <div className="flex-row">
          <SearchBar updateSearchQuery={this.updateSearchQuery}/>
        </div>
        <div className='flex-column'>
          <div className='sidebar'><SideBar /></div>
          <div className='result-list'><ResultList results={this.state.searchResults} /></div>
        </div>
      </div>
    );
  }
}

export default App;
