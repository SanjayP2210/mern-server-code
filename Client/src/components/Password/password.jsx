import React from "react";

const Password = ({
  data,
  lableShow = true,
  handleInput,
  isLoginUser,
  eyeStyle,
}) => {
  return (
    <>
      <div>
        {lableShow && <label htmlFor="password">password</label>}
        <input
          type="password"
          name="password"
          placeholder="password"
          id="password"
          required
          autoComplete="off"
          value={data.password}
          onChange={handleInput}
          disabled={!isLoginUser}
        />
        <span
          id="togglePassword"
          style={eyeStyle}
          className="login-eye-icon"
          onClick={(e) => {
            const passwordInput = document.getElementById("password");
            const type =
              passwordInput.getAttribute("type") === "password"
                ? "text"
                : "password";
            passwordInput.setAttribute("type", type);

            // Toggle the eye icon (optional)
            e.target.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
          }}
        >
          👁️
        </span>
      </div>
      <div>
        <span style={{ color: "#777777" }}>
          <strong>
            {" "}
            Password must contain 1 UpperCase, LoweCase and Number
          </strong>
        </span>
        <div id="bars">
          <div></div>
        </div>
        <div className="strength" id="strength"></div>
      </div>
    </>
  );
};

export default Password;
