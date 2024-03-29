import React from "react";
import emailjs from "emailjs-com";
import { Button } from "./ui/button.jsx";

function ContactForm() {
  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "contact_service",
        "contact_form",
        e.target,
        "lkZhs-nSIjHa0VtWJ"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  }

  return (
    <div className="contact-form-container p-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <div className="w-full max-w-md p-8 rounded shadow">
        <form className="contact-form" onSubmit={sendEmail}>
          <label className="block mt-4 font-bold">Name</label>
          <input
            type="text"
            name="user_name"
            className="border p-2 rounded bg-gray-800 text-white w-full mt-2"
          />
          <label className="block mt-4 font-bold">Email</label>
          <input
            type="email"
            name="user_email"
            className="border p-2 rounded bg-gray-800 text-white w-full mt-2"
          />
          <label className="block mt-4 font-bold">Message</label>
          <textarea
            name="message"
            className="border p-2 rounded bg-gray-800 text-white w-full mt-2"
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
