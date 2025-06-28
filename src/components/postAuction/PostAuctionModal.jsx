import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Button, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAuction } from "../../redux/apiCalls";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "1px solid lightgray",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const initialFormData = {
  title: "",
  description: "",
  startingPrice: "",
  buyNowPrice: "",
  reservePrice: "",
  endTime: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  condition: "GOOD",
  fuelType: "",
  transmission: "",
  color: "",
  vin: "",
  location: "",
  images: "",
};

const PostAuctionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { images, year, mileage, startingPrice, buyNowPrice, reservePrice, ...otherData } = formData;

      const auctionData = {
        ...otherData,
        startingPrice: parseFloat(startingPrice),
        buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : null,
        reservePrice: reservePrice ? parseFloat(reservePrice) : null,
        year: parseInt(year),
        mileage: mileage ? parseInt(mileage) : null,
        endTime: new Date(formData.endTime).toISOString(),
        images: images.split(",").map((img) => img.trim()).filter(img => img),
      };

      await createAuction(auctionData);
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error("Failed to create auction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="post-auction-modal-title"
        aria-describedby="post-auction-modal-description"
      >
        <Box sx={style}>
          <Typography id="post-auction-modal-title" variant="h6" component="h2">
            Post an Auction
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              variant="outlined"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              variant="outlined"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Starting Price"
              variant="outlined"
              name="startingPrice"
              type="number"
              value={formData.startingPrice}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Buy Now Price (optional)"
              variant="outlined"
              name="buyNowPrice"
              type="number"
              value={formData.buyNowPrice}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Reserve Price (optional)"
              variant="outlined"
              name="reservePrice"
              type="number"
              value={formData.reservePrice}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="End Date & Time"
              variant="outlined"
              name="endTime"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.endTime}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Make"
              variant="outlined"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Model"
              variant="outlined"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Year"
              variant="outlined"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mileage"
              variant="outlined"
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Condition"
              variant="outlined"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="EXCELLENT">Excellent</MenuItem>
              <MenuItem value="GOOD">Good</MenuItem>
              <MenuItem value="FAIR">Fair</MenuItem>
              <MenuItem value="POOR">Poor</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Fuel Type"
              variant="outlined"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Transmission"
              variant="outlined"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Color"
              variant="outlined"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="VIN"
              variant="outlined"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              variant="outlined"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Images (Comma separated URLs)"
              variant="outlined"
              name="images"
              value={formData.images}
              onChange={handleChange}
              multiline
              rows={2}
              helperText="Enter image URLs separated by commas"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              style={{ 
                marginTop: "16px", 
                backgroundColor: "#57b3ac",
                width: "100%"
              }}
            >
              {isLoading ? "Creating..." : "Create Auction"}
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default PostAuctionModal;