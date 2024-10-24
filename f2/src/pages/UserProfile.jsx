import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";


const UserProfile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const concealedText = (str, start, end) => {
    if (
      !str ||
      start < 0 ||
      start > str.length ||
      end < 0 ||
      end > str.length ||
      start > end
    ) {
      return str;
    }
    const maskedStr =
      str.substring(0, start) + "*".repeat(20) + str.substring(end);
    return maskedStr;
  };

  return (
    <div>
      <div className="hero my-40">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <figure>
          <img
            src="https://raw.githubusercontent.com/TanKittipat/TailwindcssWebWork1/Restful-api/src/assets/profile2.jpg"
            className="max-w-sm rounded-lg shadow-2xl"
          />
          </figure>
          <div className="w-96">
            <h2 className="card-title">UserProfile</h2>
            <h1 className="text-5xl font-bold">
              <span className="text-violet-800">{user.username}</span> Profile
            </h1>
            <p className="pt-6">
              User Id : <span className="text-slate-100">{user.id}</span>
            </p>{" "}
            <p className="pt-2">
              Email : <span className="text-slate-100">{user.email}</span>
            </p>
            <p className="pt-2">
              Roles :{" "}
              <span className="text-slate-100">
                {user?.roles.map((role) => role).join(", ")}
              </span>
            </p>
            <p className="pt-2 pb-6">
              Token :{" "}
              <span className="text-slate-100">
                {concealedText(
                  user.accessToken,
                  3,
                  user.accessToken.length - 3
                )}
              </span>
            </p>
            <a className="btn btn-secondary" href="/">
              Go back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;