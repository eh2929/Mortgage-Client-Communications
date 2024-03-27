import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

//comments
function Dashboard() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Carousel className="w-full max-w-xs" orientation="horizontal">
        <CarouselContent>
          <CarouselItem>
            <Link to="/login-signup">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <h2>Login/Signup</h2>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
          <CarouselItem>
            <Link to="/loan_applications">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <h2>Start or Track a Loan Application</h2>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
          <CarouselItem>
            <Link to="/tasks">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <h2>View or Create Tasks for Clients</h2>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
          <CarouselItem>
            <Link to="/user_profile">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <h2>Manage Your Profile</h2>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default Dashboard;
