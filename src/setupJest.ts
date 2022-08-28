import { TextEncoder } from 'util';

// Pollyfill to avoid error due to jest's jsdom env doesn't support TextEncoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
