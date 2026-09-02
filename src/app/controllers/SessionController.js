import bcrypt from 'bcrypt';
import * as Yup from 'yup';
import User from '../models/User.js'

class SessionControler {
    async store(req, res) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });

        const isValid = await schema.isValid(req.body, {
            abortEarly: false,
            strict: true,
        });

        const emailOrPasswordIncorrect = () => {
            return res
                .status(400)
                .json({ error: 'Email or password incorrect!' }) 
        }

        if (!isValid) {
            emailOrPasswordIncorrect();
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({
            where: {
                email,
            }
        })

        if (!existingUser) {
            emailOrPasswordIncorrect();  
        }

        const isPasswordCorrect = await bcrypt.compare(
            password, 
            existingUser.password_hash
        );

        if (!isPasswordCorrect) {
            emailOrPasswordIncorrect();
        }


        return res.status(200).json({ 
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email, 
            admin: existingUser.admin
        })
    }
}

export default new SessionControler();