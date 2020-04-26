import React from "react";
import imagesData from "../images.data";
import ImageCard from "../image-card/imageCard";
import "./header.style.scss";

const Header = () => (
  <div className="header">
    {imagesData
      // .filter((images, index) => index < 3)
      .map((image) => (
        <ImageCard {...image} />
      ))}
  </div>
);

export default Header;
