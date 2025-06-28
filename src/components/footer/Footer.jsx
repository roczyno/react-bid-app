const Footer = () => {
  return (
    <div className="w-full min-h-[237px] bg-black text-white flex justify-center items-center py-10 px-5">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-6xl w-full justify-between text-center md:text-left">
        
        <div className="flex flex-col gap-3 flex-1">
          <span className="font-semibold mb-2">About</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">How it works</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">About</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Media</span>
        </div>
        
        <div className="flex flex-col gap-3 flex-1">
          <span className="font-semibold mb-2">Community</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Against Discrimination</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Invite Friends</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Gift Cards</span>
        </div>
        
        <div className="flex flex-col gap-3 flex-1">
          <span className="font-semibold mb-2">Become A Seller</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Add your Vehicle</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Business Account</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Resource Center</span>
        </div>
        
        <div className="flex flex-col gap-3 flex-1">
          <span className="font-semibold mb-2">Contact Info</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Address</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Phone</span>
          <span className="text-sm cursor-pointer hover:text-primary transition-colors">Email</span>
        </div>
        
      </div>
    </div>
  );
};

export default Footer;