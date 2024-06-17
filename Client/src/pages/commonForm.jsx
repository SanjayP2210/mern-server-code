import { useState } from "react";
import { useEffect } from "react";
import apiService from "../service/apiService";
import { toast } from "react-toastify";

const CommonForm = ({ formArray = [], formName }) => {
  const [data, setData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("data", data);
      const response = await apiService.postRequest(formName, data);
      if (
        response.message?.toLocaleLowerCase() ===
        `${formName} added successfully`
      ) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      console.log(response.data);
      setData({});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    formArray.forEach((form) => {
      setData({
        ...data,
        [form?.name]: form.value || "",
      });
    });
  }, [formArray]);

  console.log("data", data);
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <section>
      <main>
        <div className="contact-content container">
          <h1 className="main-heading">{formName}</h1>
        </div>
        <div className="section-registration">
          <div className="main-container grid grid-two-cols">
            <div className="registration-form">
              <form onSubmit={handleSubmit}>
                {formArray.map((form, index) => {
                  return (
                    <div key={index}>
                      <label htmlFor={form?.name}>{form?.label}</label>
                      <input
                        type={form?.type || "text"}
                        name={form?.name || ""}
                        required={form?.required}
                        value={data?.name || ""}
                        onChange={handleInput}
                        placeholder={form?.placeholder || ""}
                      />
                    </div>
                  );
                })}
                <br />
                <button type="submit" className="btn btn-submit">
                  {`Add ${formName}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default CommonForm;
