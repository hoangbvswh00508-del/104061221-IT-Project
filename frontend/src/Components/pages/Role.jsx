import React, { useState, useEffect } from "react";
import "./styles/role.css";
import Pagination from "./paginate/paginate";

const Role = () => {
  const [currentAdmins, setCurrentAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatedRoles, setUpdatedRoles] = useState({});
  const [sortOption, setSortOption] = useState("role");
  const [isEditable, setIsEditable] = useState(true);
  const itemsPerPage = 8;
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Fetching users from server...");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched users:", data); // Debug log the fetched user data
        setCurrentAdmins(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelect = async (e, adminId, newRole) => {
    setCurrentAdmins((prevAdmins) => {
      return prevAdmins.map((admin) =>
        admin.id === adminId ? { ...admin, role: newRole } : admin
      );
    });
    try {
      const response = await fetch("http://localhost:5000/update-role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: adminId, role: newRole }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Failed to update role: ${data.message || "Unknown error"}`
        );
      }
      setAlertMessage({ type: "success", text: "Role updated successfully." });
    } catch (error) {
      console.error("Error updating role:", error);
      const errorMessage = error.message || "Error updating role";
      setAlertMessage({ type: "error", text: errorMessage });
      setCurrentAdmins((prevAdmins) => {
        return prevAdmins.map((admin) =>
          admin.id === adminId
            ? { ...admin, role: prevAdmins.find((a) => a.id === adminId).role }
            : admin
        );
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const filteredAdmins = currentAdmins.filter(
    (admin) =>
      admin.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phone?.includes(searchQuery) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAdmins = filteredAdmins.sort((a, b) => {
    if (sortOption === "name") {
      const nameA = a.username || "";
      const nameB = b.username || "";
      return nameA.localeCompare(nameB);
    } else if (sortOption === "role") {
      const roleA = a.role || "";
      const roleB = b.role || "";
      return roleA.localeCompare(roleB);
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div 
      className="container" 
      id="role"
      style={{
        border: "black 2px solid"
      }}
    >
      {alertMessage && (
        <div className={`alert alert-${alertMessage.type}`} role="alert">
          {alertMessage.text}
        </div>
      )}
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>Accounts</h2>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            style={{
              backgroundColor: "#F9FBFF",
            }}
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
              style={{
                backgroundColor: "#eaebef",
                color: "black",
                fontWeight:"500",
                border: "none"
              }}
            >
              Sorting by:{" "}
              {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleSort("name")}
                >
                  Name
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleSort("role")}
                >
                  Role
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Username</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((admin, index) => {
                return (
                  <tr key={index}>
                    <td>{admin.username || "N/A"}</td>
                    <td>{admin.phoneNum ? admin.phoneNum : "N/A"}</td>
                    <td>{admin.email || "N/A"}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id={`dropdownMenuButton-${index}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          disabled={!isEditable}
                          style={{
                            backgroundColor: "rgb(0 255 222 / 53%)",
                            color: "black",
                            fontWeight: "500",
                            border: "2px solid black"
                          }}  
                        >
                          {admin.role || "N/A"}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`dropdownMenuButton-${index}`}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={(e) =>
                                handleSelect(e, admin.id, "Admin")
                              }
                            >
                              Admin
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={(e) =>
                                handleSelect(e, admin.id, "Production Admin")
                              }
                            >
                              Production Admin
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={(e) =>
                                handleSelect(e, admin.id, "Finance Admin")
                              }
                            >
                              Finance Admin
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={(e) =>
                                handleSelect(e, admin.id, "Super Admin")
                              }
                            >
                              Super Admin
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={(e) =>
                                handleSelect(e, admin.id, "Network Admin")
                              }
                            >
                              Network Admin
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Role;
