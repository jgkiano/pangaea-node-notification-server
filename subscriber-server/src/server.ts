import express from 'express';

const PORT = process.env.NODE_SUBSCRIBER_PORT || 9000;
const app = express();
app.use(express.json());

app.get('/', (_req, res) => res.json({ message: 'subscriber API live! 🥳' }));

app.post('/:subscriber', (req, res) => {
  const { subscriber } = req.params;
  res.json({ subscriber, data: req.body });
});

app.listen(PORT, () =>
  console.log(`subscriber server running on port: ${PORT}`),
);
