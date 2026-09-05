import * as Yup from 'yup';
import Category from '../models/Category.js';


class CategoryController {
    async store(req, res){
        const schema = Yup.object({
            name: Yup.string().required(),
        });

        try {
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({
                error: err.errors
            });
        }

        const { name } = req.body;
        
        const newCategory = await Category.create({
            name,
        });

        return res.status(201).json(newCategory);
    }

    async index(_req, res) {
        const categories = await Category.findAll();
        return res.status(200).json(categories);
    }
}


export default new CategoryController();