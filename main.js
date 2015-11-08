import {Pocket} from './Pocket.js';
import {keyboardState} from './componentType/keyboardState.js';

let pocket = new Pocket();
pocket.registerComponentType(keyboardState);
console.log('pocket', pocket);
