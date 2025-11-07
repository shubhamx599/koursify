const userModel = require("../Modles/userModel.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/Jwttoken.js");
const {deleteMedia,uploadMedia} = require("../utils/cloudinary.js")

const register = async (req, res) => {
    try {
        const { email, password,role} = req.body;

        // Log incoming request data
        console.log("Request body:", req.body);

        // Validate required fields
        if (!email || !password) {
            console.log("Missing required fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required. ✋",
            });
        }
        // Validate if user already exists
        const user = await userModel.findOne({ email });
        console.log("User found in database:", user);
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email. 👤",
            });
        }

      

     const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed:", hashedPassword);

        // Create the user
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            role,
        });
        console.log("New user created:", newUser);

        // Success response
        return res.status(201).json({
            success: true,
            message: "Account created successfully! 🎉",
            user: {
                id: newUser._id,
                email: newUser.email,
                role,
            },
        });
    } catch (e) {
        console.error("Error during registration:", e);
        res.status(500).json({
            success: false,
            message: "Something went wrong on our end. Please try again later. 🛠️",
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log incoming request data
        console.log("Request body:", req.body);

        // Validate required fields
        if (!email || !password) {
            console.log("Missing required fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required. ✋",
            });
        }

        // Log email lookup
        console.log("Looking up user with email:", email);
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log("User not found in database");
            return res.status(400).json({
                success: false,
                message: "User does not exist with these credentials. 👤",
            });
        }

        // Log password comparison
        console.log("Comparing passwords for user:", user.email);
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("Password does not match for user:", user.email);
            return res.status(400).json({
                success: false,
                message: "Invalid credentials 👤",
            });
        }
        console.log("Login successful for user:", user.email);
        generateToken(res, user, `Welcome back ${user.email[0]}`);

    } catch (e) {
        console.log("Error during login:", e);
        res.status(500).json({
            success: false,
            message: "Something went wrong on our end. Please try again later. 🛠️",
        });
    }
};

const logout = (_,res) =>{
    try{

        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            success:true,
        }) 

    }catch(e){
        console.log("Error during login:", e);
        res.status(500).json({
            success: false,
            message: "Something went wrong on our end. Please try again later. 🛠️"
    }
)}
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.tokenId;
        const user = await userModel
            .findById(userId)
            .select("-password")
            .populate({
                path: "enrolledCourses",
                populate: {
                    path: "creator", 
                    select: "name email photoUrl", 
                },
            });

        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Profile found",
            success: true,
            user,
        });

    } catch (e) {
        console.error("Error fetching profile:", e);
        res.status(500).json({
            message: "Error in getting profile",
            success: false,
        });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.tokenId;
        const { name } = req.body;
        const profilePhoto = req.file;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false,
            });
        }

        let photoUrl = user.photoUrl;

        if (profilePhoto) {
            // Delete old profile picture if it exists
            if (user.photoUrl) {
                const publicId = user.photoUrl.split("/").pop().split(".")[0]; 
                await deleteMedia(publicId);
            }

            // Upload new image
            const response = await uploadMedia(profilePhoto.buffer);
            photoUrl = response.secure_url;
            console.log("New profile picture uploaded:", photoUrl);
        }

        // Prepare updated data
        const updatedData = { name };
        if (photoUrl) updatedData.photoUrl = photoUrl;

        // Update the user
        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {
            new: true,
        }).select("-password");

        return res.status(200).json({
            success: true,
            updatedUser,
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.error("Error in editing profile:", error);
        res.status(500).json({
            message: "Error in editing profile",
            success: false,
            error: error.message,
        });
    }
};





module.exports = {register,login,getUserProfile,logout,editProfile};
