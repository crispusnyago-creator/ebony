/* ============================================
   OEVI Digital Management System Engine
   Handles: Auth, ID Generation, Auto-Fill, History
   ============================================ */

const OEVISystem = {
    // --- Database Simulation (LocalStorage) ---
    db: {
        users: JSON.parse(localStorage.getItem('oevi_users') || '[]'),
        currentUser: JSON.parse(localStorage.getItem('oevi_current_user') || 'null'),
        programs: [
            "Agricultural Programs", "Health Programs", "Sports Programs", 
            "Skills and Vocational Training", "Justice and Human Rights Programs",
            "Infrastructure, Innovation and Technology", "Supply Chain and Economic Operations",
            "Community, Arts and Culture", "Education and Literacy", 
            "Environmental and Climate Resilient", "Social Protection and Vulnerable Groups",
            "Disaster Preparedness and Emergency Response", "Leadership and Governance",
            "Family and Psychosocial Support", "Micro-Enterprise and Market Access",
            "Media and Communications", "R&D for Local Innovation", 
            "Consumer Protection and Financial Advocacy"
        ]
    },

    init: function() {
        // Check if user is logged in
        if (this.db.currentUser) {
            this.updateUI();
        }
    },

    // --- 1. Registration Logic ---
    register: function(userData) {
        // Check if email exists
        if (this.db.users.some(u => u.email === userData.email)) {
            return { success: false, message: "Email already registered." };
        }

        // Generate Unique OEVI ID
        // Format: OEVI + Year(25) + 6 digit random
        const id = "OEVI25" + Math.floor(100000 + Math.random() * 900000);
        
        // Create Profile
        const newUser = {
            id: id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            district: userData.district,
            parish: userData.parish,
            village: userData.village,
            dateOfBirth: userData.dob,
            status: "Verified",
            joinDate: new Date().toLocaleDateString(),
            applications: [], // List of applied programs
            documents: [],    // List of uploaded docs
            notifications: [
                { msg: "Welcome to OEVI! Your account has been created.", date: "Just now" }
            ]
        };

        this.db.users.push(newUser);
        this.saveUsers();
        this.login(userData.email, userData.password); // Auto-login
        return { success: true, message: "Registration Successful!" };
    },

    // --- 2. Login Logic ---
    login: function(email, password) {
        // For prototype, we skip complex password check or assume password matches name
        const user = this.db.users.find(u => u.email === email);
        if (user) {
            this.db.currentUser = user;
            localStorage.setItem('oevi_current_user', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert("User not found. Please register.");
        }
    },

    logout: function() {
        this.db.currentUser = null;
        localStorage.removeItem('oevi_current_user');
        window.location.href = 'index.html';
    },

    // --- 3. Save Data ---
    saveUsers: function() {
        localStorage.setItem('oevi_users', JSON.stringify(this.db.users));
    },

    updateProfile: function(updates) {
        // Update current user in memory
        Object.assign(this.db.currentUser, updates);
        
        // Update in database array
        const index = this.db.users.findIndex(u => u.email === this.db.currentUser.email);
        if (index !== -1) {
            this.db.users[index] = this.db.currentUser;
        }
        this.saveUsers();
        localStorage.setItem('oevi_current_user', JSON.stringify(this.db.currentUser));
    },

    // --- 4. Apply for Program ---
    applyForProgram: function(programName, formData) {
        const appDate = new Date().toLocaleDateString();
        
        // Create Application Record
        const newApp = {
            id: "APP-" + Math.floor(Math.random() * 100000),
            program: programName,
            date: appDate,
            status: "Under Review", // Simulation of status
            timeline: [
                { step: "Submitted", status: "completed", date: appDate },
                { step: "Officer Verification", status: "active", date: "In Progress" },
                { step: "District Approval", status: "pending", date: "Pending" },
                { step: "Program Allocation", status: "pending", date: "Pending" }
            ]
        };

        // Add to user's history
        if (!this.db.currentUser.applications) this.db.currentUser.applications = [];
        this.db.currentUser.applications.push(newApp);
        
        this.updateProfile({ applications: this.db.currentUser.applications });
        
        // Add Notification
        this.db.currentUser.notifications.unshift({
            msg: `Your application for ${programName} has been submitted.`,
            date: "Just now"
        });
        this.updateProfile({ notifications: this.db.currentUser.notifications });

        return { success: true };
    },

    // --- 5. Helper for Dashboard Data ---
    getStats: function() {
        if (!this.db.currentUser) return {};
        const apps = this.db.currentUser.applications || [];
        return {
            total: apps.length,
            approved: apps.filter(a => a.status === "Approved").length,
            pending: apps.filter(a => a.status === "Under Review" || a.status === "Pending").length,
            rejected: apps.filter(a => a.status === "Rejected").length
        };
    },

    // --- 6. Helper for Auto-Fill ---
    getProfile: function() {
        return this.db.currentUser;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    OEVISystem.init();
});