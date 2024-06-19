import React, { useState } from 'react';
import './App.css';

function App() {
  const [numProcesses, setNumProcesses] = useState('');
  const [arrivalTimes, setArrivalTimes] = useState('');
  const [burstTimes, setBurstTimes] = useState('');
  const [priorities, setPriorities] = useState('');
  const [timeQuantum, setTimeQuantum] = useState(''); // New state for time quantum
  const [output, setOutput] = useState('');
  const [conclusion, setConclusion] = useState(''); // New state for conclusion
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation logic
    const numProcessesInt = parseInt(numProcesses.trim(), 10);
    console.log(`Parsed numProcesses: ${numProcessesInt}`);
    if (isNaN(numProcessesInt) || numProcessesInt <= 0 || numProcessesInt > 10) {
      setError('Number of processes must be a single integer between 1 and 10.');
      console.log('Validation error: Number of processes must be a single integer between 1 and 10.');
      return;
    }

    const arrivalTimesArray = arrivalTimes.split(',').map(time => parseFloat(time.trim()));
    const burstTimesArray = burstTimes.split(',').map(time => parseFloat(time.trim()));
    const prioritiesArray = priorities.split(',').map(priority => parseFloat(priority.trim()));
    const timeQuantumFloat = parseFloat(timeQuantum.trim()); // Parse time quantum

    console.log('Parsed arrivalTimes:', arrivalTimesArray);
    console.log('Parsed burstTimes:', burstTimesArray);
    console.log('Parsed priorities:', prioritiesArray);
    console.log('Parsed timeQuantum:', timeQuantumFloat);

    if (arrivalTimesArray.some(time => isNaN(time) || time < 0) ||
        burstTimesArray.some(time => isNaN(time) || time < 0) ||
        prioritiesArray.some(priority => isNaN(priority) || priority < 0) ||
        isNaN(timeQuantumFloat) || timeQuantumFloat <= 0) { // Validate time quantum
      setError('All input values must be non-negative numbers and time quantum must be positive.');
      console.log('Validation error: All input values must be non-negative numbers and time quantum must be positive.');
      return;
    }

    setError(''); // Clear any previous error message

    try {
      const response = await fetch('//http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numProcesses: numProcessesInt,
          arrivalTimes: arrivalTimesArray,
          burstTimes: burstTimesArray,
          priorities: prioritiesArray,
          timeQuantum: timeQuantumFloat // Include time quantum in the payload
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOutput(data.output);
      setConclusion(data.conclusion || ''); // Set conclusion if available
    } catch (error) {
      setError(`Fetch error: ${error.message}`);
      console.log(`Fetch error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1 className="heading">CPU SCHEDULER</h1>
      <div className="content">
        <div className="input">
          <h2>INPUT</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>No. of Processes (Not more than 10)</label>
              <input
                type="text"
                value={numProcesses}
                onChange={(e) => setNumProcesses(e.target.value)}
                placeholder="Ex: 4"
              />
            </div>
            <div className="form-group">
              <label>Arrival Times (Use Comma)</label>
              <input
                type="text"
                value={arrivalTimes}
                onChange={(e) => setArrivalTimes(e.target.value)}
                placeholder="Ex: 1,2,3,4"
              />
            </div>
            <div className="form-group">
              <label>Burst Times (Use Comma)</label>
              <input
                type="text"
                value={burstTimes}
                onChange={(e) => setBurstTimes(e.target.value)}
                placeholder="Ex: 1, 2, 3, 4"
              />
            </div>
            <div className="form-group">
              <label>Priority (Use Comma)</label>
              <input
                type="text"
                value={priorities}
                onChange={(e) => setPriorities(e.target.value)}
                placeholder="(Lower value means higher priority)"
              />
            </div>
            <div className="form-group">
              <label>Time Quantum Period (For Round Robin)</label>
              <input
                type="text"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(e.target.value)}
                placeholder="Ex: 5"
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn">Submit</button>
          </form>
        </div>
        <div className="output-section">
          <div className="output">
            <h2>OUTPUT</h2>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
