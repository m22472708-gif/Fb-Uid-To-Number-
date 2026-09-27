import { getInitialRecordsFromRaw } from './rawDatabase';
import { ContactRecord } from '../types';

export const INITIAL_RECORDS: ContactRecord[] = getInitialRecordsFromRaw();
