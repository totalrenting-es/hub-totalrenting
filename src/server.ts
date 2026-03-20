import 'dotenv/config';
import { buildApp } from './app';
import config from './config';

const start = async () => {
  try {
    const app = await buildApp();

    const { port, host } = config;

    await app.listen({ port, host });

    console.log(`Hub server running at http://${host}:${port}`);
    console.log(`Docs available at http://${host}:${port}/docs`);

    // Log configured destinations
    const { totalrenting, twipo } = config.vixiees;
    if (totalrenting.destinations.length > 0) {
      console.log(`Vixiees Totalrenting destinations: ${totalrenting.destinations.join(', ')}`);
    } else {
      console.warn('⚠ No destinations configured for Vixiees Totalrenting');
    }
    if (twipo.destinations.length > 0) {
      console.log(`Vixiees Twipo destinations: ${twipo.destinations.join(', ')}`);
    } else {
      console.warn('⚠ No destinations configured for Vixiees Twipo');
    }
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
