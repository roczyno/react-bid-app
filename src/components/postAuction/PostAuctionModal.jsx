/* eslint-disable react/prop-types */
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Button, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "../../requestMethods";

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
  startDate: "",
  endDate: "",
  distanceCv: "",
  location: "",
  modelColor: "",
  transmission: "",
  engineType: "",
  startingBid: "",
  buyNowPrice: "",
  images: "",
};

const PostAuctionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { startDate, endDate, images, ...otherData } = formData;

    const formattedData = {
      ...otherData,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      images: images.split(",").map((img) => img.trim()),
    };

    try {
      await userRequest.post("/auction", formattedData);
      toast.success("Auction posted successfully!");
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      toast.error("Failed to post auction.");
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
              label="Start Date"
              variant="outlined"
              name="startDate"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="End Date"
              variant="outlined"
              name="endDate"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Distance (CV)"
              variant="outlined"
              name="distanceCv"
              value={formData.distanceCv}
              onChange={handleChange}
              required
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
              label="Model Color"
              variant="outlined"
              name="modelColor"
              value={formData.modelColor}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Transmission"
              variant="outlined"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="Automatic">Automatic</MenuItem>
              <MenuItem value="Manual">Manual</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Engine Type"
              variant="outlined"
              name="engineType"
              value={formData.engineType}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Starting Bid"
              variant="outlined"
              name="startingBid"
              type="number"
              value={formData.startingBid}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Buy Now Price"
              variant="outlined"
              name="buyNowPrice"
              type="number"
              value={formData.buyNowPrice}
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
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "16px" }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default PostAuctionModal;
