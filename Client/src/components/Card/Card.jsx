import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import apiService from "../../service/apiService";
import Loader from "../Loader/Loader";
import { FaPlus, FaTrash } from "react-icons/fa";

const Card = ({ endPoint, arrayName, componentName, visibleFields }) => {
  const { isAdmin, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    setIsLoading(true);
    const response = await apiService.getRequest(endPoint);
    setList(response?.[arrayName]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    setIsLoading(true);
    const response = await apiService.deleteRequest(`${endPoint}/${id}`);
    if (response) {
      toast.success(response.message);
      fetchItems();
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  const ItemList = ({ items, renderItem, index }) => {
    const keys = Object.keys(items);
    return (
      <div key={index}>
        {keys.map((item, index) => {
          if (typeof items[item] === "object") {
            const data = items[item];
            const itemKeys = Object.keys(items[item]);
            return itemKeys.map((itemVal, ind) => {
              return renderItem(itemVal, data);
            });
          }
          return renderItem(item, items);
        })}
      </div>
    );
  };

  return (
    <>
      <Loader visible={loading} />
      <section className="admin-contacts-section">
        <div className="contact-content container">
          <h1 className="main-heading">{`${componentName} List`}</h1>
          {isAdmin && (
            <button
              className="btn"
              onClick={() => navigate(`/admin/add-${componentName}`)}
            >
              <FaPlus />
            </button>
          )}
        </div>

        <div className="admin-users admin-contact-form">
          {list?.map((listItem, index) => {
            return (
              <div key={index} className="contact-card">
                <ItemList
                  items={listItem}
                  index={index}
                  renderItem={(item, data, indexs) => {
                    if (!visibleFields.includes(item)) return <></>;
                    return (
                      <>
                        <p key={indexs}>
                          {item} : <strong>{data[item]}</strong>
                        </p>
                        <br />
                      </>
                    );
                  }}
                />
                <br />
                <br />
                {isAdmin && (
                  <button
                    className="btn"
                    onClick={() => deleteItem(listItem._id)}
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

export default Card;
