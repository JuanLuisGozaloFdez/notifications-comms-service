import app from './app';

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`notifications-comms-service listening on port ${PORT}`);
});
