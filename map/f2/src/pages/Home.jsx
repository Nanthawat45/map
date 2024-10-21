import React from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <SignedOut>
        <h1 className="text-4xl md:text-5xl md:leading-snug font-bold my-2">
          Welcome to your Map
        </h1>
      </SignedOut>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
    </div>
  );
};

export default Home;