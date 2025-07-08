import React from "react";
import { motion } from "framer-motion";
import {
  FaPaw, FaUsers, FaShoppingCart, FaBook, 
  FaUserCircle, FaCommentAlt, FaHeart, FaDog 
} from "react-icons/fa";
import { GiDogBowl, GiDogHouse, GiSittingDog } from "react-icons/gi";
import { IoMdPaw } from "react-icons/io";
import "../css/AboutUs.css";

const AboutUs = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="about-us">
      {/* Hero Banner */}
      <motion.section 
        className="hero-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            Welcome to <span>Whisker World</span>
          </motion.h1>
          <motion.p 
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Where Dogs and Their Humans Thrive Together
          </motion.p>
          <div className="stats-container">
            <div className="stat-item">
              <FaHeart className="stat-icon" />
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Happy Members</span>
            </div>
            <div className="stat-item">
              <FaDog className="stat-icon" />
              <span className="stat-number">75,000+</span>
              <span className="stat-label">Dogs Helped</span>
            </div>
            <div className="stat-item">
              <IoMdPaw className="stat-icon" />
              <span className="stat-number">12</span>
              <span className="stat-label">Years of Trust</span>
            </div>
          </div>
          <img 
            src="/public/img/6963167.jpg" 
            alt="Diverse group of happy dogs and owners in a park" 
            className="hero-image" 
            loading="lazy"
          />
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section 
        className="our-story"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
      >
        <motion.div className="story-content" variants={item}>
          <h2>Our Story</h2>
          <p>
            Founded in 2010 by a group of passionate dog lovers, Whisker World began as a small local meetup 
            and grew into the largest online community for dog enthusiasts. What started as a way to share 
            training tips became a movement to improve the lives of dogs everywhere.
          </p>
          <p>
            Today, we're proud to connect over 50,000 members worldwide, offering resources, products, 
            and most importantly - a supportive community that understands the special bond between dogs 
            and their humans.
          </p>
        </motion.div>
        <motion.div className="story-image" variants={item}>
          <img 
            src="/public/img/6963167.jpg" 
            alt="Whisker World founders with their dogs" 
            loading="lazy"
          />
        </motion.div>
      </motion.section>

      {/* Core Features Section */}
      <section className="core-features-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why Our Community Loves Us
        </motion.h2>
        
        <div className="core-features">
          {[
            {
              icon: <FaUsers />,
              title: "Community Hub",
              desc: "Connect with thousands of verified dog owners to share experiences, arrange playdates, and get breed-specific advice.",
              img: "/public/img/donation-community-service-volunteer-support.jpg",
              color: "#FF7E5F"
            },
            {
              icon: <FaBook />,
              title: "Expert Resources",
              desc: "Vetted articles on training, health, and nutrition curated by certified veterinarians and professional trainers.",
              img: "/public/img/expert.jpg",
              color: "#4E9FCC"
            },
            {
              icon: <GiDogBowl />,
              title: "Trusted Marketplace",
              desc: "Community-rated products with honest reviews from real dog owners. We test everything with our own pups first!",
              img: "/public/img/6963167.jpg",
              color: "#8A6FDF"
            }
          ].map((feature, index) => (
            <motion.div 
              className="feature-card"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ '--accent-color': feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <div className="feature-image">
                <img src={feature.img} alt={feature.title} loading="lazy" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Profile System */}
      <section className="profile-system">
        <motion.div 
          className="profile-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Tailored For You and Your Pup</h2>
          <p className="profile-subtitle">
            Our comprehensive profile system helps you get the most personalized experience
          </p>
          
          <div className="profile-types">
            {[
              {
                icon: <FaUserCircle />,
                title: "Owner Profiles",
                desc: "Showcase your experience level, training philosophy, and connect with like-minded owners."
              },
              {
                icon: <FaPaw />,
                title: "Pet Profiles",
                desc: "Detailed pages for each dog including health records, personality traits, and favorite activities."
              },
              {
                icon: <GiSittingDog />,
                title: "Breed Matching",
                desc: "Find dogs with similar traits or discover compatible breeds for your lifestyle."
              }
            ].map((profile, index) => (
              <motion.div 
                className="profile-card"
                key={index}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="profile-icon">{profile.icon}</div>
                <h4>{profile.title}</h4>
                <p>{profile.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="profile-showcase">
            <img 
              src="/public/img/dog-lover.jpg" 
              alt="Example of a Whisker World profile page showing dog and owner information" 
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Voices From Our Pack
        </motion.h2>
        
        <div className="testimonial-grid">
          {[
            {
              quote: "Found the perfect trainer for my rescue through Whisker World! The community recommendations saved us months of trial and error.",
              name: "Sarah K.",
              role: "Rescue Dog Mom",
              img: "/public/img/istockphoto-1399565382-612x612.jpg"
            },
            {
              quote: "The nutrition guides helped me find food that finally worked for my picky eater. He's healthier and happier than ever!",
              name: "Michael T.",
              role: "French Bulldog Owner",
              img: "/public/img/smart-looking-teacher.jpg"
            },
            {
              quote: "Moving to a new city was scary, but through Whisker World I found an amazing dog park and made friends for me and my pup!",
              name: "Jessica L.",
              role: "Labrador Lover",
              img: "/public/img/jesika.jpeg"
            }
          ].map((testimonial, index) => (
            <motion.div 
              className="testimonial-card"
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.5 }}
            >
              <FaCommentAlt className="quote-icon" />
              <blockquote>{testimonial.quote}</blockquote>
              <div className="user-info">
                <img src={testimonial.img} alt={testimonial.name} loading="lazy" />
                <div>
                  <span className="user-name">{testimonial.name}</span>
                  <span className="user-role">{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Meet Our Pack Leaders
        </motion.h2>
        
        <div className="team-grid">
          {[
            {
              name: "Dr. Emma Rodriguez",
              role: "Head Veterinarian",
              bio: "Certified veterinary behaviorist with 15 years of experience in canine nutrition and wellness.",
              img: "/public/img/drface.jpg",
              dog: "Buddy (Golden Retriever)"
            },
            {
              name: "James Chen",
              role: "Community Director",
              bio: "Professional dog trainer specializing in positive reinforcement methods for all breeds.",
              img: "/public/img/smiling.avif",
              dog: "Luna & Max (Border Collies)"
            },
            {
              name: "Sophia Patel",
              role: "Product Curator",
              bio: "Former shelter manager who tests every product with her rescue dogs before approval.",
              img: "/public/img/sophia.jpeg",
              dog: "Roxy (Pitbull Mix)"
            }
          ].map((member, index) => (
            <motion.div 
              className="team-card"
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="team-image">
                <img src={member.img} alt={member.name} loading="lazy" />
                <div className="dog-badge">
                  <FaPaw /> {member.dog}
                </div>
              </div>
              <h3>{member.name}</h3>
              <span className="team-role">{member.role}</span>
              <p>{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="cta-content">
          <GiDogHouse className="cta-icon" />
          <h2>Ready to Join the Pack?</h2>
          <p>
            Become part of the most supportive dog community online. Whether you're a new puppy parent or 
            seasoned dog lover, we've got everything you need to give your pup their best life.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Sign Up Free</button>
            <button className="cta-button secondary">Take a Tour</button>
          </div>
          <div className="trust-badges">
            <span>Trusted by 50,000+ dog owners</span>  
            <span>Vet-approved resources</span>
            <span>100% spam-free</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;