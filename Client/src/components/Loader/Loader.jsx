import "./Loader.css"; // Make sure to create and style this CSS file
import { TailSpin } from "react-loader-spinner";

const Loader = ({ visible, style }) => {
  return (
    // <TailSpin // Type of spinner
    //   height="120"
    //   width="120"
    //   color="#4fa94d"
    //   ariaLabel="tail-spin-loading"
    //   radius="1"
    //   wrapperStyle={{}}
    //   wrapperClass="spinner-div"
    //   visible={visible}
    // />
    <>
      {visible && (
        <>
          <div className="spinner-div" style={style}>
            {/* <div className="cell">
              <div className="circle fade-out-right-1">
                <p className="fade-out-right-1"></p>
              </div>
            </div> */}

            {/* first loader */}
            {/* <div className="cell">
              <div className="circle loader"></div>
            </div> */}

            {/* second loader */}
            {/*<div className="loader-div">
              <div className="loader-5"></div>
            </div>{" "}
            */}

            {/* third loader */}
            <div class="waterfall">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          {/* <div className="spinner-div">
            <div className="cell">
              <div className="circle fade-out-right-2">
                <p className="fade-out-right-2"></p>
              </div>
            </div>
          </div> */}
        </>
      )}
    </>
  );
};

export default Loader;
