import { Link } from "react-router-dom";
import "../css/social.css";
const Social = () => {
    return (
        <div className="social">
            <section className="social-detail">
                <h1>Social Media for Pets</h1>
                <h3>The Cutest Community on The Planet 🌎🐾</h3>
                <p>What would your pet say if they could speak? Petzbe is a social media app & community where we share our pets' lives from the perspective of our pets. As it turns out, people become very friendly, funny, and cute when they speak as their pets – our community is living proof of that! While we're a pet community at the core, we’re expanding to become a trusted hub for all sorts of pet-related information, a platform for pet companies to engage with pet parents, and ultimately the go-to platform worldwide for all things pet-related. </p>
                
                {/* Video Section */}
                <div className="video-container">
                <video width="900" controls loop autoPlay muted>
                        <source src="/videos/1video.mp4" type="video/mp4" />
                        
                    </video>
                </div>
            </section>
        </div>
    );
};

export default Social;
