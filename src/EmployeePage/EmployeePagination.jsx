import React, { useEffect, useState } from "react";
import './Employee.css';

const EMPLOYEE_API = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
const ROWS_PER_PAGE = 10;

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(EMPLOYEE_API);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
        alert("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const displayedEmployees = employees.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Create an array of page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="employee-container">
      <h1 className="table-title">Employee Data Table</h1>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination-controls">
        <button 
          className="pagination-button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        {/* Create numbered page buttons with the exact page number in a span */}
        {pageNumbers.map(number => (
          <button 
            key={number}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            onClick={() => setCurrentPage(number)}
          >
            {/* This ensures the exact page number is in a span element */}
            <span>{number}</span>
          </button>
        ))}
        
        <button 
          className="pagination-button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;