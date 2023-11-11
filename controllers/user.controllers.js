
import bcryptjs from 'bcryptjs';
import  { pool }  from "../db/config.db.js";


const createUser = async (req, res) => {
    try {
      const { password, contact_info,  ...rest } = req.body;

      
      // Generar hash de la contraseña
      const salt = bcryptjs.genSaltSync();
      const hashedPassword = bcryptjs.hashSync(password, salt);


      
      // Crear nuevo usuario con la contraseña hasheada
      const newUser = {
        password: hashedPassword,
        contact_info: contact_info ? JSON.stringify(contact_info) : null,
        ...rest
      };
      
  
      // Consulta para insertar el nuevo usuario en la tabla
      const [result] = await pool.query('INSERT INTO users set ?', [newUser]);
  
      // Obtener el ID del nuevo usuario
      const userId = result.insertId;
      console.log(userId);
  
      // Consulta para obtener el usuario recién creado
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      const user = rows.length > 0 ? rows[0] : null;
  
      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('createUser Error:', error);
      let errorMessage = 'Something went wrong, please contact the administrator';
  
      // Verificar si el error es por duplicado de email
      if (error.code === 'ER_DUP_ENTRY') {
        errorMessage = 'Email already in use. Please choose a different one.';
        res.status(400).json({
          success: false,
          error: errorMessage
        });
      } else {
        res.status(500).json({
          success: false,
          error: errorMessage
        });
      }
    }
}

const getAllUsers = async (req, res) => {
  try {
    const { p = 1, r = 10 } = req.query;

    // Obtener el total de usuarios
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM users WHERE status = 1');
    const total = totalRows[0].total;

    // Obtener los usuarios con paginación
    const [users] = await pool.query(
      'SELECT * FROM users WHERE status = 1 LIMIT ? OFFSET ?',
      [Number(r), Math.max(Number(p) - 1, 0) * Number(r)]
    );

    const pagination = {
      curr_page: p,
      total_reg: total,
      total_pages: Math.ceil(total / r),
      page_size: r,
    };

    if (Number(p) < Math.ceil(total / r)) {
      pagination.next_page_uri = `/api/user/${Number(p) + 1}?p=${Number(p) + 1}&r=${r}`;
    }

    res.json({
      success: true,
      users,
      pagination,
    });
  } catch (error) {
    console.log('getAllUsers Error:', error);
    let errorMessage = 'Something went wrong, please contact the administrator';

    res.status(500).json({
      error: errorMessage,
    });
  }
};

const editUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, contact_info, ...rest } = req.body;

    // Obtener el usuario por ID
    const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (existingUser.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

// Verificar si se está cambiando el correo electrónico
if (email !== '' && email !== null)  {

  if(email !== existingUser[0].email){
   const [emailInUse] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (emailInUse) {
      return res.status(400).json({
        success: false,
        message: "The new email is already in use by another user.",
      });
    }
  }
}

  const editedUser = {
    ...rest,
    contact_info: contact_info ? JSON.stringify(contact_info) : null,
  }
  
   // Actualizar el usuario
    const [result] = await pool.query('UPDATE users set ? WHERE id = ?', [editedUser, id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        error: "Failed to update user.",
      });
    }

    // Obtener el usuario actualizado
    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      user: updatedUser[0],
    });
  } catch (error) {
    console.log('editUserById Error:', error);
    let errorMessage = 'Something went wrong, please contact the administrator';

    res.status(500).json({
      error: errorMessage,
    });
  }
};



  export {
          createUser,
          getAllUsers,
          editUserById
         }