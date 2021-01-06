const express = require('express')
const authRouter = require('./server/routes/AuthRouter.js')
const productsRouter = require('./server/routes/ProductsRouter.js')
const ordersRouter = require('./server/routes/OrdersRouter.js')
const usersRouter = require('./server/routes/UsersRouter.js')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);

app.use('*', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
