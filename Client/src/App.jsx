import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "./pages/Register.jsx";
import { Login } from "./pages/Login.jsx";
import { UserList } from "./pages/UserList.jsx";
import { Logout } from "./pages/Logout.jsx";
import { AdminUpdate } from "./pages/Admin-Update.jsx";
import { Error } from "./pages/Error.jsx";
import { Home } from "./pages/Home.jsx";
import { AdminContact } from "./pages/Admin-Contact.jsx";
import PrivateRoute from "./router/privateRouter.jsx";
import AdminAuthor from "./pages/Admin-Author.jsx";
import AdminBook from "./pages/Admin-Book.jsx";
import BookList from "./pages/BookList.jsx";
import { AuthorList } from "./pages/AuthorList.jsx";
import { ContactList } from "./pages/ContactList.jsx";
import UploadImage from "./components/UploadImage/UploadImage.jsx";
import Profile from "./pages/Profile.jsx";
import Technology from "./pages/Technology.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import LoginRegister from "./pages/LoginRegister.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/upload-image" element={<UploadImage />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="home" element={<Home />} />
            <Route path="contact" element={<ContactList />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="book" element={<BookList />} />
            <Route path="author" element={<AuthorList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="technology" element={<Technology />} />
            <Route path="user/:id/edit" element={<AdminUpdate />} />
          </Route>
          <Route path="*" element={<Error />} />
          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="users" element={<UserList />} />
            <Route path="add-book" element={<AdminBook />} />
            <Route path="add-contact" element={<AdminContact />} />
            <Route path="add-author" element={<AdminAuthor />} />
            <Route path="user/:id/edit" element={<AdminUpdate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
