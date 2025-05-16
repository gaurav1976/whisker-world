import React, { useState, useEffect } from "react";
import "../css/ExpertsTips.css";

const ExpertsTips = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedTip, setExpandedTip] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [question, setQuestion] = useState("");
    const [submittedQuestions, setSubmittedQuestions] = useState([]);

    const tips = [
        {
            id: 1,
            title: "Nutrition Tips",
            description: "Discover the best diet plans for your pet based on breed, age, and health condition.",
            detailedContent: [
                "Puppies need 2-3x more calories per pound than adult dogs",
                "Senior cats benefit from increased fiber and reduced fat",
                "Avoid grapes, chocolate, and onions - toxic to most pets",
                "Consult your vet before switching diets"
            ],
            image: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            expert: "Dr. Sarah Johnson, DVM",
            expertBio: "Board-certified veterinary nutritionist with 12 years of clinical experience",
            icon: "🍗"
        },
        {
            id: 2,
            title: "Training & Behavior",
            description: "Step-by-step guides to train your pet and address behavior issues.",
            detailedContent: [
                "Positive reinforcement works best for 90% of dogs",
                "Consistency is key - train in short 5-10 minute sessions",
                "Early socialization prevents fearfulness",
                "Separation anxiety can be managed with gradual training"
            ],
            image: "https://images.unsplash.com/photo-1583511655826-05700442b31b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            expert: "Michael Chen, CPDT-KA",
            expertBio: "Certified Professional Dog Trainer specializing in positive reinforcement",
            icon: "🐕"
        },
        {
            id: 3,
            title: "Health & Wellness",
            description: "Essential healthcare tips for your pet's wellbeing.",
            detailedContent: [
                "Annual checkups can detect problems early",
                "Dental disease affects 80% of dogs over age 3",
                "Know your pet's normal temperature and pulse",
                "Regular parasite prevention is crucial"
            ],
            image: "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            expert: "Dr. Emily Rodriguez, DVM",
            expertBio: "Veterinary internal medicine specialist with emergency care expertise",
            icon: "❤️"
        },
        {
            id: 4,
            title: "Grooming Advice",
            description: "Professional grooming techniques for home care.",
            detailedContent: [
                "Brush regularly to prevent mats and reduce shedding",
                "Use pet-safe shampoos - human products can irritate skin",
                "Nail trims every 3-4 weeks prevent painful overgrowth",
                "Clean ears weekly to prevent infections"
            ],
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            expert: "Lisa Park, CMG",
            expertBio: "Certified Master Groomer with 15 years of professional experience",
            icon: "✂️"
        }
    ];

    const filteredTips = tips.filter(tip => 
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmitQuestion = (e) => {
        e.preventDefault();
        if (question.trim()) {
            setSubmittedQuestions([...submittedQuestions, {
                id: Date.now(),
                question: question,
                answer: "Our expert will respond within 48 hours",
                date: new Date().toLocaleDateString()
            }]);
            setQuestion("");
        }
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <div className="experts-tips-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Expert Pet Care Guidance <span className="paw-icon">🐾</span></h1>
                    <p>Trusted advice from licensed veterinarians and certified pet professionals</p>
                    <div className="search-barr">
                        <input 
                            type="text" 
                            placeholder="Search tips (e.g., 'kitten nutrition')" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button>Search</button>
                    </div>
                </div>
            </section>

            {/* Tips Grid */}
            <section className="tips-container">
                {filteredTips.map((tip) => (
                    <div 
                        key={tip.id} 
                        className="tip-card"
                        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${tip.image})` }}
                        onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                    >
                        <div className="card-content">
                            <div className="card-header">
                                <span className="category-icon">{tip.icon}</span>
                                <h2>{tip.title}</h2>
                            </div>
                            <p className="expert-name">{tip.expert}</p>
                            <p className="tip-description">{tip.description}</p>
                            <button className="learn-more">
                                {expandedTip === tip.id ? "Show Less" : "Learn More"}
                            </button>
                            
                            {expandedTip === tip.id && (
                                <div className="expanded-content">
                                    <h3>Expert Advice:</h3>
                                    <ul>
                                        {tip.detailedContent.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                    <div className="expert-bio">
                                        <h4>About {tip.expert.split(",")[0]}:</h4>
                                        <p>{tip.expertBio}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* Ask the Expert Section */}
            <section className="ask-expert-section">
                <h2>Ask Our Experts</h2>
                <div className="ask-expert-container">
                    <form onSubmit={handleSubmitQuestion} className="question-form">
                        <textarea
                            placeholder="Type your pet care question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                        <button type="submit">Submit Question</button>
                    </form>
                    
                    {submittedQuestions.length > 0 && (
                        <div className="questions-list">
                            <h3>Your Submitted Questions:</h3>
                            {submittedQuestions.map((q) => (
                                <div key={q.id} className="question-item">
                                    <p className="question-date">{q.date}</p>
                                    <p className="question-text"><strong>Q:</strong> {q.question}</p>
                                    <p className="answer-text"><strong>A:</strong> {q.answer}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <h2>Get Weekly Expert Tips</h2>
                <p>Subscribe to our newsletter for fresh pet care advice delivered to your inbox</p>
                {subscribed ? (
                    <div className="subscription-success">
                        <p>🎉 Thank you for subscribing! Check your email for confirmation.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="newsletter-form">
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            required 
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                )}
            </section>
        </div>
    );
};

export default ExpertsTips;