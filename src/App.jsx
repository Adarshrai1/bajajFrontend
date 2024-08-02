import React, { useState } from 'react';
import Select from 'react-select';
import './App.css';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const apiUrl = 'https://bajajbackend-prg5.onrender.com/bfhl';

  const options = [
    { value: 'Numbers', label: 'Numbers' },
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Highest Alphabet', label: 'Highest Alphabet' }
  ];

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON format: "data" should be an array.');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();
      if (response.ok) {
        setResponse(result);
        setError(null);
      } else {
        setError(result.message || 'An error occurred');
      }
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;
    const selectedValues = selectedOptions.map(option => option.value);

    return (
      <div className="response">
        {selectedValues.includes('Alphabets') && (
          <div>
            <strong>Alphabets:</strong> {alphabets.join(', ')}
          </div>
        )}
        {selectedValues.includes('Numbers') && (
          <div>
            <strong>Numbers:</strong> {numbers.join(', ')}
          </div>
        )}
        {selectedValues.includes('Highest Alphabet') && (
          <div>
            <strong>Highest Alphabet:</strong> {highest_alphabet.join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Bajaj Frontend</h1>
      <div className="input-section">
        <textarea
          placeholder='Enter JSON here'
          value={jsonData}
          onChange={handleJsonChange}
          rows="5"
          cols="50"
          className="json-input"
        />
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
      {error && <div className="error">{error}</div>}
      {response && (
        <div className="filter-section">
          <Select
            isMulti
            name="filters"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSelectChange}
          />
        </div>
      )}
      {renderResponse()}
    </div>
  );
}

export default App;
