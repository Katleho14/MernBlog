import User from '../models/user.model.js';

export const signup = async (req, res) => {
 const{username, email, password} = req.body;
 
 if(!username || !email || !password || username === "" || email === "" || password === ""){
     return res.status(400).json({error: "All fields are required"});
};

const user = new User({
    username,
    email,
    password
});

try{
    await new User.save();
    res.json("Signup successfull");
} catch(error) {
    return res.status(400).json({ message: error.message });
}


};