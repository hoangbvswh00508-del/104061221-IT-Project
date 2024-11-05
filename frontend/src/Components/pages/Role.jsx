import React, { useState } from 'react';
import './styles/role.css';
import Pagination from './paginate/paginate';

const Role = () => {
  const [currentAdmins, setCurrentAdmins] = useState([
    { name: 'John Doe', company: 'Company A', phone: '123-456-7890', email: 'john@example.com', country: 'USA', status: 'Admin' },
    { name: 'Jane Smith', company: 'Company B', phone: '987-654-3210', email: 'jane@example.com', country: 'Canada', status: 'Editor' },
    { name: 'Ronald Richards', company: 'Adobe', phone: '(302) 555-0107', email: 'ronald@adobe.com', country: 'Israel', status: 'Viewer' },
    { name: 'Marvin McKinney', company: 'Tesla', phone: '(252) 555-0126', email: 'marvin@tesla.com', country: 'Iran', status: 'Admin' },
    { name: 'Jerome Bell', company: 'Google', phone: '(528) 555-0129', email: 'jerome@google.com', country: 'Réunion', status: 'Editor' },
    { name: 'Kathryn Murphy', company: 'Microsoft', phone: '(406) 555-0120', email: 'kathryn@microsoft.com', country: 'Curaçao', status: 'Viewer' },
    { name: 'Jacob Jones', company: 'Yahoo', phone: '(208) 555-0112', email: 'jacob@yahoo.com', country: 'Brazil', status: 'Admin' },
    { name: 'Kristin Watson', company: 'Facebook', phone: '(704) 555-0127', email: 'kristin@facebook.com', country: 'Åland Islands', status: 'Editor' },
    { name: 'Michael Brown', company: 'Apple', phone: '(123) 555-0123', email: 'michael@apple.com', country: 'USA', status: 'Viewer' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('status');
  const itemsPerPage = 8;

  const handleSelect = (e, originalIndex) => {
    const newStatus = e.target.value;
    const updatedAdmins = [...currentAdmins];
    updatedAdmins[originalIndex].status = newStatus;
    setCurrentAdmins(updatedAdmins);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const filteredAdmins = currentAdmins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.phone.includes(searchQuery) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAdmins = filteredAdmins.sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'company') {
      return a.company.localeCompare(b.company);
    } else if (sortOption === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAdmins.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>Admin Roles</h2>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-2 d-flex justify-content-end">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sorting by: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li><button className="dropdown-item" onClick={() => handleSort('name')}>Name</button></li>
              <li><button className="dropdown-item" onClick={() => handleSort('company')}>Company</button></li>
              <li><button className="dropdown-item" onClick={() => handleSort('status')}>Status</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Company</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Country</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((admin, index) => {
                const originalIndex = currentAdmins.findIndex(a => a.email === admin.email);
                return (
                  <tr key={index}>
                    <td>{admin.name}</td>
                    <td>{admin.company}</td>
                    <td>{admin.phone}</td>
                    <td>{admin.email}</td>
                    <td>{admin.country}</td>
                    <td>
                      <select className="form-control" value={admin.status} onChange={(e) => handleSelect(e, originalIndex)}>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="d-flex justify-content-end mt-3">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
