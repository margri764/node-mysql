import jwt from 'jsonwebtoken';

export const generateToken = async ( userName ) => {

    const expiresIn = 60 * 60 * 24  * 30;

    const payload = { userName };


try {
    const token = jwt.sign( payload , process.env.SECRETORPRIVATEKEY, { expiresIn })

    return token;
    
} catch (error) {

    console.log("ERROR generateToken: ",error);
}
        

}




