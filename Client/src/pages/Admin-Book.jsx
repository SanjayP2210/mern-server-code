import { useState, useEffect } from "react";
import apiService from "../service/apiService";
import Loader from "../components/Loader/Loader";
import { toast } from "react-toastify";

const AdminBook = () => {
  const [data, setData] = useState({
    title: "",
    genre: "",
    authorId: "",
  });
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await apiService.getRequest(`author`);
      setAuthors(response.authors);
    };
    fetchAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.postRequest("book", data);
      console.log(response.data);
      if (response) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      setData({ title: "", genre: "", authorId: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <>
      <Loader visible={false} />
      <section>
        <main>
          <div className="contact-content container">
            <h1 className="main-heading">Book</h1>
          </div>
          <div className="section-registration">
            <div className="main-container grid grid-two-cols">
              <div className="registration-form">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      autoComplete="off"
                      placeholder="Title"
                      value={data.title}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="genre">Genre</label>
                    <input
                      type="text"
                      name="genre"
                      placeholder="Genre"
                      id="genre"
                      required
                      autoComplete="off"
                      value={data.genre}
                      onChange={handleInput}
                    />
                  </div>

                  <div>
                    <label htmlFor="authorId">Author</label>
                    <select
                      id="authorId"
                      name="authorId"
                      value={data.authorId}
                      onChange={handleInput}
                      required
                    >
                      <option value="">Select an Author</option>
                      {authors?.map((author) => (
                        <option key={author?._id} value={author?._id}>
                          {author?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <br />
                  <button type="submit" className="btn btn-submit">
                    Add Book
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default AdminBook;
