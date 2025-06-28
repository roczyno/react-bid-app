import "./contact.scss";

const Contact = () => {
  return (
    <div className="contact">
      <h1>Contact Us</h1>
      <div className="container">
        <div className="wrapper">
          <div className="top">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <div className="bottom">
            <input type="email" placeholder="Email Address" />
            <input type="text" placeholder="Subject" />
          </div>
          <textarea placeholder="Your Message"></textarea>
        </div>
        <button>Send Message</button>
      </div>
    </div>
  );
};

export default Contact;
