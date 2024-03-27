import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { UserContext } from "./UserContext"; // Import UserContext
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./ui/navigation-menu";

function NavBar() {
  const { user } = useContext(UserContext); // Use UserContext

  return (
    <nav className="flex justify-between items-center p-4 flex-grow">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className="text-white mr-4">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/loan_applications" className="text-white mr-4">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Loan Applications
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/tasks" className="text-white mr-4">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Tasks
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex justify-end">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/login-signup" className="text-white mr-4">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Login/Signup
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <Link to="/user_profile" className="text-white mr-4">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    User Profile
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        {user && <Logout />}
      </div>
    </nav>
  );
}

export default NavBar;
