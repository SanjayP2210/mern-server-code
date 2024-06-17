import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeUser } from "../reducers/userReducer";
// import Loader from "../components/Loader/Loader";
import Loader from "../components/Loader/Loader";
import { FaEdit, FaTrash } from "react-icons/fa";
import apiService from "../service/apiService";
import _, { debounce } from "lodash";
import defaultImage from "../assets/images/png/default_profile.png";

export const UserList = () => {
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSearching, setIsSearching] = useState(false);

  const { error, loading, users, status, isUserDeleted, response } =
    useSelector((state) => {
      return state.user;
    });

  // Debounced function
  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => dispatch(fetchUsers(searchQuery)), 500),
    []
  );

  useEffect(() => {
    if (isSearching) {
      const params = new URLSearchParams({
        page,
        sortBy,
        search,
        sortOrder,
      });
      debouncedFetchResults(params);
      setIsSearching(false);
    }
    // Cancel any pending debounced function calls when the component unmounts or query changes
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [search, debouncedFetchResults]);

  useEffect(() => {
    if (isSearching) return;
    const params = new URLSearchParams({
      page,
      search,
      sortBy,
      sortOrder,
    });

    dispatch(fetchUsers(params));
  }, [page, sortBy, sortOrder, search]);

  useEffect(() => {
    if (!loading && response) {
      setUserList(response?.users || []);
      setTotalPages(response?.totalPages);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isUserDeleted) {
      dispatch(fetchUsers());
    }
  }, [isUserDeleted]);

  const handleSearchChange = (e) => {
    setIsSearching(true);
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setSortBy(key);
    setSortOrder(direction);
    setPage(1);
    // const sortedData = [...userList].sort((a, b) => {
    //   if (a[key] < b[key]) {
    //     return direction === "asc" ? -1 : 1;
    //   }
    //   if (a[key] > b[key]) {
    //     return direction === "asc" ? 1 : -1;
    //   }
    //   return 0;
    // });
    // setUserList(sortedData);
  };

  const getSortIcon = (key) => {
    sortBy;
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? "🔼" : "🔽";
  };

  return (
    <>
      <Loader // Type of spinner
        visible={loading}
      />
      {status != "loading" && (
        <section className="container">
          <div className="contact-content">
            <h1 className="main-heading">User List</h1>
          </div>
          <div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <form style={{ width: "50%", margin: "20px" }}>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="input"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search By Name..."
                />
              </form>
            </div>

            {/* <select value={sortBy} onChange={handleSortChange}>
              <option value="userName">Name</option>
              <option value="email">Email</option>
              <option value="isAdmin">Role</option>
            </select>
            <select value={sortOrder} onChange={handleSortOrderChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select> */}
            <table className="table border" id="sortable-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th onClick={() => handleSort("userName")}>
                    Name {getSortIcon("userName")}
                  </th>
                  <th onClick={() => handleSort("email")}>
                    Email {getSortIcon("email")}
                  </th>
                  <th onClick={() => handleSort("mobileNumber")}>
                    Mobile Number {getSortIcon("mobileNumber")}
                  </th>
                  <th onClick={() => handleSort("isAdmin")}>
                    Role {getSortIcon("isAdmin")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {status != "loading" &&
                  userList?.map((data) => (
                    <tr key={data?._id.toString()}>
                      <td>
                        <img
                          className="nav-profile-image"
                          src={`${
                            data?.image?.url &&
                            data?.image?.url?.includes("res.cloudinary.com")
                              ? data?.image?.url
                              : defaultImage
                          }`}
                          alt="profile image"
                        />
                      </td>
                      <td>{data?.userName}</td>
                      <td>{data?.email}</td>
                      <td>{data?.mobileNumber}</td>
                      <td>{data?.isAdmin ? "Admin" : "User"}</td>
                      <td>
                        <button
                          style={{ marginRight: "10px" }}
                          className="btn btn-primary"
                          onClick={() => {
                            navigate(`/admin/user/${data._id}/edit`);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            dispatch(removeUser(data?._id));
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>{`      Page ${page}     `}</span>
              <button
                onClick={() =>
                  setPage((prev) => {
                    return Math.min(prev + 1, totalPages);
                  })
                }
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
