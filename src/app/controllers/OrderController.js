import * as Yup from 'yup'; 
import Category from '../models/Category.js';
import Product from '../models/Product.js';



class OrderController {
    async store(req, res) {
        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(), 
                    quantity: Yup.number().required()
                })
            )
        });

        try {
            schema.validateSync(req.body, { abortEarly: false, strict: true });
        } catch (err) {
            return res.status(400).json({
                error: err.errors
            });
        }

        const { userId, userName } = req;
        const { products } = req.body;

        const productIds = products.map((product) => product.id)

        const findedProducts = await Product.findAll({
            where: {
                id: productIds
            },
            include: {
                model: Category,
                as: 'category',
                attributes: ['name'],
            }
        })

        const mapedProducts = findedProducts.map(product => {
            const quantity = products.find(p => p.id === product.id).quantity;

            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price, 
                url: product.url,
                category: product.category.name,
                quantity

            }

            return newProduct
        })

        const order = {
            user: {
                id: userId,
                name: userName,
            },
            products: mapedProducts,
            status: "Pedido realizado!"
        }
        return res.status(201).json(order)
    }


}


export default new OrderController();