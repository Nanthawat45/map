import React from "react";
import UserProfile from "./UserProfile";
import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";
import { useAuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const menus = {
    ROLES_ADMIN: [
      { name: "Add Academic", link: "/add" },

      { name: "Home", link: "/" },
    ],
    ROLES_USER: [
      { name: "Home", link: "/" }
    ],
    ROLE_MODERATOR: [
      { name: "Add restaurant", link: "/add" },
      { name: "Home", link: "/" },
    ],
  };
  //console.log("user", user);
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <ul className="menu menu-horizontal px-1">      
           {user &&
          //ถ้า menus user.ROLE_ADMIN role ตำแหน่งที่ 1 มาจาก user 
          
            menus[user.roles[0]].map((menuItem) => (             
              <li key={menuItem.name}>
                <a
                  href={menuItem.link}
                  className="text-white hover:text-gray-300"
                >
                  {menuItem.name}{" "}
                </a>
              </li>
            ))}            
        </ul>
        <div className="navbar-end space-x-2">
          {user && (
            <div className="text-center">
              welcome : <span className="font-medium">{user.username}</span>
              <div className="space-x-1 font-normal">
                {user.roles.map((role, index) => {
                  return (
                  <span
                    key={index}
                    className="badge badge-primary badge-outline text-xs"
                  >
                    {role}
                  </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="navbar-end">
          {user ? (
            <UserProfile logout={logout} />
          ) : (
            <div className="space-x-2 flex">
              <RegisterButton />
              <LoginButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;