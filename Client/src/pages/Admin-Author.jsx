import { useState } from "react";
import apiService from "../service/apiService";
import Loader from "../components/Loader/Loader";

const AdminUpdateAuthor = () => {
  const [data, setData] = useState({
    name: "",
    age: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.postRequest("author", data);
      console.log(response.data);
      setData({
        name: "",
        age: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

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
            <h1 className="main-heading">Author</h1>
          </div>
          <div className="section-registration">
            <div className="main-container grid grid-two-cols">
              <div className="registration-form">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="off"
                      placeholder="Name"
                      value={data.name}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="age">Age</label>
                    <input
                      name="age"
                      placeholder="Age"
                      type="number"
                      value={data.age}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  <br />
                  <button type="submit" className="btn btn-submit">
                    Add Author
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

export default AdminUpdateAuthor;
