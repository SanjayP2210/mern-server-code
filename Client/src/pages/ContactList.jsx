import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact, deleteContact } from "../reducers/contactReducer";
import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { getJWTToken } from "../constants/utilities";
import { AdminContact } from "./Admin-Contact";
import { FaAd, FaPlus, FaTrash } from "react-icons/fa";
export const ContactList = () => {
  const token = getJWTToken();
  if (!token) {
    return <AdminContact />;
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdmin, isLoggedIn } = useSelector((state) => state.auth);
  const { contacts, isContactDeleted, loading } = useSelector(
    (state) => state.contact
  );
  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    dispatch(fetchContact());
  }, []);

  useEffect(() => {
    if (contacts) {
      setContactData(contacts);
    }
  }, [contacts]);

  useEffect(() => {
    if (isContactDeleted) {
      dispatch(fetchContact());
    }
  }, [isContactDeleted]);
  return (
    <>
      <Loader visible={loading} />
      <section className="admin-contacts-section">
        <div className="contact-content container">
          <h1 className="main-heading">Contact List</h1>
          {isAdmin && (
            <button
              className="btn"
              onClick={() => navigate("/admin/add-contact")}
            >
              <FaPlus />
            </button>
          )}
        </div>

        <div className="admin-users admin-contact-form">
          {contactData.map((curContactData, index) => {
            const { username, email, message, _id } = curContactData;

            return (
              <div key={index} className="contact-card">
                <p>{username}</p>
                <br />
                <p>{email}</p>
                <br />
                <p>{message}</p>
                <br />
                <br />
                {isAdmin && (
                  <button
                    className="btn"
                    onClick={() => dispatch(deleteContact(_id))}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
