const Contact = () => {
  return (
    <div className="flex flex-col items-center gap-5 w-full min-h-[600px] my-12 px-5">
      <h1 className="text-2xl md:text-3xl font-medium">Contact Us</h1>
      
      <div className="w-full max-w-4xl min-h-[500px] rounded-lg border border-gray-300 flex flex-col justify-center items-center gap-6 p-6 md:p-8">
        
        <div className="flex flex-col gap-5 w-full max-w-2xl">
          <div className="flex flex-col md:flex-row gap-5">
            <input 
              type="text" 
              placeholder="First Name" 
              className="flex-1 p-3 rounded border border-gray-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              className="flex-1 p-3 rounded border border-gray-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-5">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-1 p-3 rounded border border-gray-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <input 
              type="text" 
              placeholder="Subject" 
              className="flex-1 p-3 rounded border border-gray-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <textarea 
            placeholder="Your Message" 
            rows="6"
            className="w-full p-3 rounded border border-gray-300 outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          ></textarea>
        </div>
        
        <button className="px-8 py-3 w-full max-w-xs bg-primary text-white border-none rounded cursor-pointer font-medium hover:bg-primary/90 transition-colors">
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Contact;