import React, { useState } from 'react';

const SearchBar = ({ onSearch, onFilter }) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleFilter = () => {
    onFilter({ category, location, workType });
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: 0, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search internships..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '500px', height: '40px' }}
        />
        <button type="submit" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: '-1px', height: '40px', padding: '0 15px' }}>Search</button>
      </form>
      <div className="filter-section">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Software Development">Software Development</option>
          <option value="Cloud Computing">Cloud Computing</option>
          <option value="Design">Design</option>
          <option value="DevOps">DevOps</option>
          <option value="Data Science">Data Science</option>
        </select>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={workType} onChange={(e) => setWorkType(e.target.value)}>
          <option value="">All Work Types</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <button onClick={handleFilter}>Apply Filters</button>
      </div>
    </div>
  );
};

export default SearchBar;
