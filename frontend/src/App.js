import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  /*Link,*/
  Navigate,
} from 'react-router-dom';
import './App.css';
import MyCalendar from './components/Calendar';
import ToDoMain from './components/ToDoMain';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/calendar" element={<MyCalendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/todomain" element={<ToDoMain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
