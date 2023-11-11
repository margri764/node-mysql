
import  { generateToken }  from "../helpers/tokenManager.js";
import  { pool }  from "../db/config.db.js";
import bcryptjs from 'bcryptjs';



const login = async (req, res) => {
    try {
      const { userName, password } = req.body;
  
      const [rows] = await pool.execute('SELECT * FROM users WHERE userName = ?', [userName]);
      const user = rows[0];
  
      if (!user) {
        return res.status(403).json({
          success: false,
          message: 'Invalid access'
        });
      }
  
      const checkPassword = bcryptjs.compareSync(password, user.password);
      if (!checkPassword) {
        return res.status(403).json({
          success: false,
          message: 'Invalid access'
        });
      }
  
      // Genera el token
      const token = await generateToken(userName);
  
      return res.status(200).json({
        success: true,
        token,
        user
      });
  
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Something went wrong, please contact the administrator';
  
      res.status(500).json({
        success: false,
        error: errorMessage
      });
    }
  };

const signUp = async (req, res) => {
try {
    const { userName } = req.userAuth;

    // Consulta para buscar el usuario por userName
    const [rows] = await pool.execute('SELECT * FROM users WHERE userName = ?', [userName]);
    const user = rows.length > 0 ? rows[0] : null;

    res.status(200).json({
    success: true,
    user
    });

} catch (error) {
    console.log('signUp Error: ', error);
    let errorMessage = 'Something went wrong, please contact the administrator';
    return res.status(500).json({
    success: false,
    message: errorMessage
    });
}
};
  

  export { 
            login,
            signUp
  }

