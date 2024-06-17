import { useState, useEffect } from "react";
import apiService from "../service/apiService";
import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Card from "../components/Card/Card";

const BookList = () => {
  const { isAdmin, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    setIsLoading(true);
    const response = await apiService.getRequest("book");
    setBooks(response.books);
    setIsLoading(false);
  };
  // useEffect(() => {
  //   fetchBooks();
  // }, []);

  const deleteBook = async (id) => {
    setIsLoading(true);
    const response = await apiService.deleteRequest(`book/${id}`);
    if (response) {
      toast.success(response.message);
      fetchBooks();
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* <Loader visible={loading} /> */}
      <Card
        endPoint="book"
        arrayName="books"
        visibleFields={["genre", "name", "age"]}
        componentName="book"
      />
      {/* <section className="admin-contacts-section">
        <div className="contact-content container">
          <h1 className="main-heading">Book List</h1>
          {isAdmin && (
            <button className="btn" onClick={() => navigate("/admin/add-book")}>
              add book
            </button>
          )}
        </div> */}

      {/* <div className="admin-users admin-contact-form">
          {books.map((book, index) => {
            return (
              <div key={index} className="contact-card">
                <p>
                  <strong>{book.title}</strong> - {book.genre}
                </p>
                <br />
                <p>
                  by {book.author.name} ({book.author.age} years old)
                </p>
                <br />
                <br />
                {isAdmin && (
                  <button className="btn" onClick={() => deleteBook(book._id)}>
                    delete
                  </button>
                )}
              </div>
            );
          })}
        </div> */}
      {/* </section> */}
    </>
  );
};

export default BookList;
