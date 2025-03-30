import { getConfig } from '@/config';
import axios from 'axios';

export const axiosGateWay = axios.create({
  baseURL: getConfig().apiGateWayUrl + '/api',
});
