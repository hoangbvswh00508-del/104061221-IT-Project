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

  const rolePriority = {
    "Super Admin": 1,
    "Admin": 2,
    "Production Admin": 3,
    "Finance Admin": 4,
    "Network Admin": 5,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        console.log("Fetching users from server...");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched users:", data);
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
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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

    if (option === "role") {
      const sortedAdmins = [...currentAdmins].sort((a, b) => {
        const roleA = a.role || "";
        const roleB = b.role || "";

        const priorityA = rolePriority[roleA] || Number.MAX_SAFE_INTEGER;
        const priorityB = rolePriority[roleB] || Number.MAX_SAFE_INTEGER;

        return priorityA - priorityB;
      });

      setCurrentAdmins(sortedAdmins);
    }

    if (option === "name") {
      const sortedAdmins = [...currentAdmins].sort((a, b) => {
        const nameA = a.username?.toLowerCase() || "";
        const nameB = b.username?.toLowerCase() || "";

        return nameA.localeCompare(nameB);
      });

      setCurrentAdmins(sortedAdmins);
    }
  };

  const filteredAdmins = currentAdmins.filter(
    (admin) =>
      admin.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phone?.includes(searchQuery) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      className="container"
      id="role"
      style={{
        backgroundColor: "#fffefe",
        boxShadow: "0px 10px 60px 0px rgba(226, 236, 249, 0.5)",
        fontFamily: "'Poppins', sans-serif",
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
                fontWeight: "500",
                border: "none",
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
                            border: "2px solid black",
                            backgroundColor: "#89c6b9"
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
                              onClick={(e) => handleSelect(e, admin.id, "Admin")}
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
