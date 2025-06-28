import "./about.scss";
import Bg from "../../assets/about.png";

const About = () => {
  return (
    <div className="about">
      <div className="top">
        <img src={Bg} alt="" />
      </div>
      <div className="bottom">
        <h2>About Us</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
          nemo dolorem tenetur dolorum facilis eius culpa soluta temporibus!
          Maxime labore consequuntur corporis sapiente magnam? Harum cumque
          molestias reprehenderit. Distinctio animi expedita eveniet, quaerat
          blanditiis ea adipisci ad beatae alias eum quod, non perferendis
          consequatur, necessitatibus culpa facilis facere possimus est!
        </p>
      </div>
    </div>
  );
};

export default About;
