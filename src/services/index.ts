import { api } from './api';
import * as fallbackHandler from './fallbackHandler';

// Always use the real API (Supabase) for all services
export { api, fallbackHandler };
