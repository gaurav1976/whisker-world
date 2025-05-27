import React from "react";
import "../css/Communities.css"; // Make sure the CSS file is in the correct path

const Communities = () => {
  // Sample community data
  const communities = [
    {
      name: "Dog Lovers",
      image: "/img/dog-lover.jpg",
      description: "Join this group to connect with dog lovers and share experiences!",
    },
    {
      name: "Cat Enthusiasts",
      image: "/img/Cat-Enthusiasts.jpg",
      description: "For cat owners who love sharing tips, stories, and cute pictures!",
    },
    {
      name: "Exotic Pets",
      image: "/img/Exotic Pets.jpg",
      description: "Discuss reptiles, birds, and other unique pets in this community.",
    },
    {
      name: "Pet Adoption & Rescue",
      image: "/img/Pet Adoption & Rescue.jpeg",
      description: "Help pets find loving homes and connect with adopters and rescuers.",
    },
    {
      name: "Training & Behavior",
      image: "/img/training-dog.jpg",
      description: "Share training tips and behavioral advice for all types of pets.",
    },
    {
      name: "Pet Health & Wellness",
      image: "/img/Pet Health & Wellness.jpg",
      description: "Get expert advice and support on pet health, illnesses, and vet care.",
    },
    {
      name: "Pet-Friendly Travel",
      image: "/img/Pet travel.jpg",
      description: "Discover the best travel tips, destinations, and accommodations for pet owners.",
    },
    {
      name: "Lost & Found Pets",
      image: "/img/Lost pet.jpg",
      description: "Help reunite lost pets with their owners by sharing information and resources.",
    }
  ];

  return (
    <div className="communities-page">
      <h1 className="communities-title">Join a Community</h1>
      <div className="community-grid">
        {communities.map((community, index) => (
          <div className="community-card" key={index}>
            <img src={community.image} alt={community.name} />
            <h2 className="community-name">{community.name}</h2>
            <p className="community-description">{community.description}</p>
            <button
  className="join-btn"
  onClick={() => window.open('https://chat.whatsapp.com/KvM2il2ZuFV0ICPXnNVH4y', '_blank')}
>
  Join Community
</button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Communities;
