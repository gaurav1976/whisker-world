import "../css/Happiness.css";
// import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Social from "./Social";
const middlepage = () => {
  console.log("hii")
  return (<>
    <Navbar/>
    <div className="happiness-container">
      
      <div className="text-content">
        <h1>Happiness Sharing</h1>
        <p>
          Whisker World is the new social network just for pets! <br />
          Share adorable photos & videos of your furry friends and connect with other pet lovers. 🐾
        </p>

        <p>It's the purrrrfect place to share and enjoy beautiful photos and videos of our four-legged friends in a loving community.</p>
        <p>Connect with like-minded pet owners by giving your cat or dog a dedicated social media presence.</p>
      </div>
      <div className="mobile-img">
      <img src="/img/mobile-img.jpg" alt="Mobile Preview" />

      </div>
    </div>
    <Social/>
 </>
  );
};

export default middlepage;
