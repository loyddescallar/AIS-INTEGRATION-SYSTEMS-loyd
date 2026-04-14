import validator from "validator";
import bcrypt from "bcryptjs";
import tokenGenerator from "../utils/tokenGenerator.js";
import generateException from "../utils/exceptionGenerator.js";

const getUser = async (id, conn) => {
    const [user] = await conn.query('SELECT * FROM user WHERE id = ?', [id]);
    return user[0];
};

export const createUser = async (name, userProfile, email, password, conn) => {
    // 1. Validation
    if (!name || !email || !password) {
        generateException('TypeError', 'Name, Email and Password are required.', 400);
    }

    if (!validator.isEmail(email)) {
        generateException('TypeError', 'Invalid email address.', 400);
    }

    // 2. Check if user already exists
    const [existing] = await conn.query("SELECT email FROM user WHERE email = ?", [email]);
    if (existing.length > 0) {
        generateException('Error', `The email ${email} is already used.`, 400);
    }

    // 3. Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 4. DISABLED EXTERNAL API (Preventing ETIMEDOUT)
    /* await fetch('https://ais-simulated-legacy.onrender.com/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
    });
    */

    // 5. Insert into XAMPP Database (Including all your new columns)
    const [newUser] = await conn.query(
        "INSERT INTO user(name, email, password, birthdate, address, program, studentStatus) VALUES(?,?,?,?,?,?,?)", 
        [
            name, 
            email, 
            hashedPassword, 
            userProfile.birthdate, 
            userProfile.address, 
            userProfile.program, 
            userProfile.studentStatus
        ]
    );

    return newUser;
};

export const login = async (email, password, conn) => {
    if (!email || !password) throw new Error('Email and Password are required');

    const [user] = await conn.query("SELECT * FROM user WHERE email = ?", [email]);

    if (user.length === 0) {
        throw new Error(`An account with email: ${email} does not exist.`);
    }

    if (!bcrypt.compareSync(password, user[0].password)) {
        throw new Error('Incorrect password');
    }

    return tokenGenerator(user[0].id);
};

export const doesUserExist = async (id, conn) => {
    const user = await getUser(id, conn);
    if (!user) generateException('Error', 'User not found.', 404);
    return true;
};