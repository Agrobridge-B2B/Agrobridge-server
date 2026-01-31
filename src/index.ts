import { config } from './config';
import app from './app';
import { connectDB } from './config/database';

connectDB(process.env.MONGO_URI || '');

const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`✅ Server is running at http://localhost:${PORT}/api`);
});
