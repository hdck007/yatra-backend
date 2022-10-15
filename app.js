const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;
const morgan = require('morgan');
const eventRoutes = require('./src/routes/events.routes');
const logRoutes = require('./src/routes/logs.routes');
const tagRouter = require('./src/routes/tags.routes');
const authRouter = require('./src/routes/auth.routes');
const verifyJWT = require('./src/middlewares/verifyJwt');

app.use(cors());

app.use(morgan('tiny'));
app.use(express.json());

// route for logs
app.use('/user', authRouter);
app.use('/log', verifyJWT, logRoutes);
app.use('/event', verifyJWT, eventRoutes);
app.use('/tag', verifyJWT, tagRouter);

app.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Hello' });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
