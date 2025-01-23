import User from "../models/user.model.js"

const deleteUser = async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
   
        if(req.userId !== user._id.toString()) return res.status(403).json({error:"You can delete only your account"})

        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "User deleted successfully"});
    
    } catch (error) {
        return res.status(500).json({error: "Something went wrong", details: error.message});
    }
}


const getUser = async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        user.password=undefined;
        res.status(200).json(user);
    
    } catch (error) {
        return res.status(500).json({error: "Something went wrong", details: error.message});
    }
}

const fetchUser = async (req,res)=>{
    try {
        const user = await User.findById(req.userId);
        user.password=undefined;
        res.status(200).json(user);
    
    } catch (error) {
        return res.status(500).json({error: "Something went wrong", details: error.message});
    }
}


export {deleteUser,getUser,fetchUser}