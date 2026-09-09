import React from "react";
import Footer from "../Footer";
import JoinUs from "../JoinUs";
import ContactForm from "../ContactForm";
import EmailTicker from "../EmailTicker";

const Contact: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  return (
    <div className="bg-trillex-black min-h-screen pt-28">
      <ContactForm isActive={isActive} />
      <EmailTicker />
      <JoinUs />
      <Footer />
    </div>
  );
};

export default Contact;
