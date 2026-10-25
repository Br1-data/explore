import { createGameServer } from './server';

const port = Number(process.env.PORT ?? 2567);
const game = createGameServer({ profilePath: process.env.PROFILE_DB ?? 'data/profiles.sqlite' });
game.server.listen(port, () => console.log(`Segnale Remoto server su http://localhost:${port}`));
