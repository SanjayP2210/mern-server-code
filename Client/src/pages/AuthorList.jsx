// import { useEffect, useState } from "react";
// import Loader from "../components/Loader/Loader";
// import { useNavigate } from "react-router-dom";
// import apiService from "../service/apiService";
// import { useSelector } from "react-redux";
import Card from "../components/Card/Card";

export const AuthorList = () => {
  // const navigate = useNavigate();
  // const [authors, setAuthors] = useState([]);
  // const [loading, setIsLoading] = useState(true);

  // const fetchAuthors = async () => {
  //   setIsLoading(true);
  //   const response = await apiService.getRequest("author");
  //   setAuthors(response.authors);
  //   setIsLoading(false);
  // };
  // useEffect(() => {
  //   fetchAuthors();
  // }, []);

  // const deleteAuthor = async (id) => {
  //   setIsLoading(true);
  //   const response = await apiService.deleteRequest(`author/${id}`);
  //   if (response) {
  //     toast.success(response.message);
  //     fetchAuthors();
  //   } else {
  //     toast.error(response.message);
  //   }
  //   setIsLoading(false);
  // };

  return (
    <>
      <Card
        endPoint="author"
        arrayName="authors"
        visibleFields={["name", "age"]}
        componentName="author"
      />
      {/* <Loader visible={loading} /> */}
      {/* <section className="admin-authors-section">
        <div className="contact-content container">
          <h1 className="main-heading">Author List</h1>
          {isAdmin && (
            <button
              className="btn"
              onClick={() => navigate("/admin/add-author")}
            >
              add author
            </button>
          )}
        </div>

        <div className="admin-users admin-contact-form">
          {authors.map((curAuthorData, index) => {
            const { name, age, _id } = curAuthorData;

            return (
              <div key={index} className="contact-card">
                <p>{name}</p>
                <br />
                <p>{age}</p>
                <br />
                <br />
                {isAdmin && (
                  <button
                    className="btn"
                    onClick={() => dispatch(deleteAuthor(_id))}
                  >
                    delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section> */}
    </>
  );
};
