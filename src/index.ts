import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}/api`);
});
