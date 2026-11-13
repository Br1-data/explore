import '@fontsource-variable/fraunces/index.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import './stile.css';
import { App } from './ui/app';

const radice = document.getElementById('app');
if (!radice) throw new Error('Manca l’elemento #app');
new App(radice);
