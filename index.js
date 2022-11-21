require('./ping');

const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

const authRouter = require('./server/routes/AuthRouter')
const productsRouter = require('./server/routes/ProductsRouter')
const ordersRouter = require('./server/routes/OrdersRouter')
const usersRouter = require('./server/routes/UsersRouter')
const internalRouter = require('./server/routes/InternalRouter')
const healthcheckRouter = require('./server/routes/Healthcheck')

const limiter = require('./server/middlewares/rate-limiter')

const app = express()
const port = process.env.PORT || 3000 

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(limiter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/internal', internalRouter);
app.use('/healthcheck', healthcheckRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('*', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

