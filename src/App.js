import React, { Component } from 'react'
import SearchBar from './components/SearchBar'
import SideBar from './containers/SideBar'
import ResultList from './containers/ResultList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchBar />
        <SideBar />
        <ResultList />
      </div>
    );
  }
}

export default App;
