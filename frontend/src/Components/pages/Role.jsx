import React, { useState } from 'react';
import './styles/role.css';
import Pagination from './paginate/paginate';

const Role = () => {
  const [currentAdmins, setCurrentAdmins] = useState([
    { name: 'John Doe', company: 'Company A', phone: '(123)-456-7890', email: 'john@example.com', country: 'USA', role: 'Admin' },
    { name: 'Jane Smith', company: 'Company B', phone: '(987)-654-3210', email: 'jane@example.com', country: 'Canada', role: 'Production Administrator' },
    { name: 'Ronald Richards', company: 'Adobe', phone: '(302) 555-0107', email: 'ronald@adobe.com', country: 'Israel', role: 'Admin' },
    { name: 'Marvin McKinney', company: 'Tesla', phone: '(252) 555-0126', email: 'marvin@tesla.com', country: 'Iran', role: 'Production Administrator' },
    { name: 'Jerome Bell', company: 'Google', phone: '(528) 555-0129', email: 'jerome@google.com', country: 'Réunion', role: 'Network Administrator' },
    { name: 'Kathryn Murphy', company: 'Microsoft', phone: '(406) 555-0120', email: 'kathryn@microsoft.com', country: 'Curaçao', role: 'Network Administrator' },
    { name: 'Jacob Jones', company: 'Yahoo', phone: '(208) 555-0112', email: 'jacob@yahoo.com', country: 'Brazil', role: 'Network Administrator' },
    { name: 'Kristin Watson', company: 'Facebook', phone: '(704) 555-0127', email: 'kristin@facebook.com', country: 'Åland Islands', role: 'Finance Administrator' },
    { name: 'Michael Brown', company: 'Apple', phone: '(123) 555-0123', email: 'michael@apple.com', country: 'USA', role: 'Finance Administrator' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedRoles, setUpdatedRoles] = useState({});
  const [sortOption, setSortOption] = useState('role');
  const [currentAdminsState, setAdminsState] = useState(currentAdmins);
  const [isEditable, setIsEditable] = useState(false);
  const itemsPerPage = 8;

  const handleSelect = (e, index) => {
    const newRole = e.target.value;
    setCurrentAdmins(prevAdmins => {
      const updatedAdmins = [...prevAdmins];
      updatedAdmins[index].role = newRole;
      return updatedAdmins;
    });
    setUpdatedRoles(prevState => ({
      ...prevState,
      [index]: newRole
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const handleSaveChanges = () => {
    const updatedAdmins = currentAdminsState.map((admin, index) => {
      if (updatedRoles[index]) {
        return { ...admin, role: updatedRoles[index] };
      }
      return admin;
    });
    setCurrentAdmins(updatedAdmins);
    setIsEditable(false);
    // Update the state or make an API call to save the changes
    console.log(updatedAdmins);
  };

  const handleEdit = () => {
    setIsEditable(true);
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
    } else if (sortOption === 'role') {
      return a.role.localeCompare(b.role);
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
    <div className="container" id="role">
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
              <li><button className="dropdown-item" onClick={() => handleSort('role')}>Role</button></li>
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
                <th>Role</th>
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
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id={`dropdownMenuButton-${index}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          disabled={!isEditable}
                        >
                          {admin.role}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${index}`}>
                          <li><button className="dropdown-item" onClick={() => handleSelect({ target: { value: 'Admin' } }, originalIndex)}>Admin</button></li>
                          <li><button className="dropdown-item" onClick={() => handleSelect({ target: { value: 'Production Administrator' } }, originalIndex)}>Production Administrator</button></li>
                          <li><button className="dropdown-item" onClick={() => handleSelect({ target: { value: 'Finance Administrator' } }, originalIndex)}>Finance Administrator</button></li>
                          <li><button className="dropdown-item" onClick={() => handleSelect({ target: { value: 'Network Administrator' } }, originalIndex)}>Network Administrator</button></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="d-flex justify-content-end mt-3">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
          <div className="d-flex justify-content-end mt-3">
            {!isEditable ? (
              <button className="btn btn-secondary" onClick={handleEdit}>Edit</button>
            ) : (
              <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
