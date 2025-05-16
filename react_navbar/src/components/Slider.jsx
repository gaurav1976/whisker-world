import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "../css/Slider.css"; // Import custom styles

const Slider = () => {
  console.log('hii')
  
  return (
    <div className="slider-container">
      {/* Header Section */}
      <h1 className="slider-header">Our Blog</h1>

      {/* Bootstrap Carousel */}
      <Carousel data-bs-theme="dark">

        {/* First Slide */}
        <Carousel.Item>

          <div className="about-container">
            <div className="about-text">
              <h2>"Keeping Your Pets Happy"</h2>
              <p>
                "Owning a pet is a rewarding experience, but it also comes with important responsibilities. Whether you’re a new pet parent or a seasoned owner, it’s essential to understand the key aspects of pet care to ensure your furry companion lives a long, healthy, and happy life. Ensure that the food you’re feeding your pet is nutritionally balanced and appropriate for their age, breed, and health needs. Consult with your vet about the best diet for your pet. Overfeeding can lead to obesity."
              </p>
              <a href="Explore"><button className="Blog-More">Explore More</button></a>
            </div>
            <div className="about-image">
              <img src="/img/happy-dog.jpg" alt="About Us" />
            </div>
          </div>
        </Carousel.Item>

        {/* Second Slide */}
        <Carousel.Item>
          <div className="about-container">
            <div className="about-text">
              <h2>"Best Diet for Dogs & Cats"</h2>
              <p>
                A balanced diet is crucial for your pet's well-being. Learn how to choose the right food for your pet’s specific needs and keep them healthy and active.
              </p>
              <a href="Explore"><button className="Blog-More">Explore More</button></a>
            </div>
            <div className="about-image">
              <img src="/img/dog-food.webp" alt="About Us" />
            </div>
          </div>
        </Carousel.Item>

        {/* Third Slide */}
        <Carousel.Item>
          <div className="about-container">
            <div className="about-text">
              <h2>"Pet Health Tips You Should Know"</h2>
              <p>
                Regular checkups, exercise, and mental stimulation are key to your pet's overall well-being. Discover expert advice to keep your pet in top shape.
              </p>
              <a href="Explore"><button className="Blog-More">Explore More</button></a>
            </div>
            <div className="about-image">
              <img src="/img/pet-health.webp" alt="About Us" />
            </div>
          </div>
        </Carousel.Item>

      </Carousel>

      {/* Our Shop */}
      <div className="our-shop">
        <h1 className="our-shop-header">Our Best Sellers</h1>
        <div className="shop-container">
          {[
            { src: "./img/montego.jpg", title: "montego", price: "₹199.99" },
            { src: "./img/optinum chicken.jpg", title: "optinum chicken", price: "₹399.99" },
            { src: "./img/Energy food 3.jpg", title: "Energy Bar", price: "₹99.99" },
            { src: "./img/Energy food 4.jpg", title: "Multigrain Chocos", price: "₹149.99" },
            { src: "./img/Energy food 5.jpg", title: "Meal Replacement EnergyBar", price: "₹159.99" },
            { src: "./img/Energy food 6.jpg", title: "Energy Bar", price: "₹149.99" },
            { src: "./img/Energy food 7.jpg", title: "Energy Drink", price: "₹89.99" },
            { src: "./img/pedigree.webp", title: "Pedigree", price: "₹499.99" },
            { src: "./img/chunks.jpeg", title: "Chunks in Gravy", price: "₹299.99" },
            { src: "./img/fidele.webp", title: "Fidele", price: "₹249.99" },
          ].map((item, index) => (
            <div key={index} className="shop-item text-center">
              <div className="shop-card border-100 bg-light mb-2">
                <div className="shop-card-body">
                  <img src={item.src} className="img-fluid" alt={item.title} />
                </div>
              </div>
              <h6>{item.title}</h6>
              <p>{item.price}</p>
              <div className="shop-buttons">
                {/* <button className="small-btn">Add To Cart</button>
                <button className="small-btn">Buy Now</button> */}
              </div>
            </div>
          ))}

          <a href="Food">
            <button className="Click-More">Click For More</button>
          </a>
        </div>
      </div>


    </div>



  );
};

export default Slider;