import React from "react";
import NavBar from "./NavBar";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 flex-grow">
      <NavBar />
    </header>
  );
}

export default Header;
