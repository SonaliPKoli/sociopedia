import jwt from "jsonwebtoken";
//authorization for the person eho is not logged in
export const verifyToken =async (req,res,next)=>{
    try {
        //set token in frontend and grab it in backend
        let token =req.header("Authorization");
        if(!token){
            return res.status(403).send("Access Denied");
        }
        //token would be placed after the bearer grabbing actual token
        if(token.startWith("Bearer ")){
            token=token.slice(7,token.length).trimLeft();
        }
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        next();
        
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}