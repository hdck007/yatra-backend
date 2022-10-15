const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;
const morgan = require('morgan');
const eventRoutes = require('./src/routes/events.routes');
const logRoutes = require('./src/routes/logs.routes');
const tagRouter = require('./src/routes/tags.routes');

app.use(cors());

app.use(morgan('tiny'));
app.use(express.json());

// route for logs
app.use('/log', logRoutes);
app.use('/event', eventRoutes);
app.use('/tag', tagRouter);

app.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Hello' });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
