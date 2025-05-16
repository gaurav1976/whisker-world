import { useEffect, useState } from "react";
// import AddPet from "./AddPet";
import PetProfile from "./PetProfile";
import "../css/Dashboard.css"; // Create this CSS file for styling

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [refreshPets, setRefreshPets] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handlePetAdded = () => {
        setRefreshPets(prev => !prev); // Toggle to trigger PetProfile refresh
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome to Your Dashboard, {user?.name || "User"}</h2>
            
            {user ? (
                <div className="dashboard-content">
                    <div className="user-info">
                        <h3>Your Profile</h3>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>

                    {/* <div className="pet-section">
                        <h3>Your Pets</h3>
                        <PetProfile userId={user._id} key={refreshPets} />
                        
                        <div className="add-pet-section">
                            <h4>Add a New Pet</h4>
                            <AddPet userId={user._id} onPetAdded={handlePetAdded} />
                        </div>
                    </div> */}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Dashboard;