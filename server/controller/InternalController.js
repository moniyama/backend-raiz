const db = require('../db/models');

const list = async (req, res) => {
    try {
        const [users, orders, productsOrders] = await Promise.all([
            db.Users.count(),
            db.Orders.count(),
            db.ProductsOrders.count()
        ]);

        return res.json({ users, orders, productsOrders });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const deleteOptions = {
    where: {},
    truncate: true
};
const reset = async (req, res) => {
    try {
        const [users, orders, productsOrders] = await Promise.all([
            db.Users.destroy(deleteOptions),
            db.Orders.destroy(deleteOptions),
            db.ProductsOrders.destroy(deleteOptions)
        ]);

        return res.json({ users, orders, productsOrders });
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    list, reset
}