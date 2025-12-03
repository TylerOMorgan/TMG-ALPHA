import React from 'react';
import Footer from '../Footer';
import JoinUs from '../JoinUs';
import ContactForm from '../ContactForm';
import EmailTicker from '../EmailTicker';

const Contact: React.FC = () => {
  return (
    <div className="bg-trillex-black min-h-screen pt-28">
      <ContactForm />
      <EmailTicker />
      <JoinUs />
      <Footer />
    </div>
  );
};

export default Contact;