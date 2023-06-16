import axios from 'axios';
import queryString from 'query-string';
import { ShowcaseInterface, ShowcaseGetQueryInterface } from 'interfaces/showcase';
import { GetQueryInterface } from '../../interfaces';

export const getShowcases = async (query?: ShowcaseGetQueryInterface) => {
  const response = await axios.get(`/api/showcases${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createShowcase = async (showcase: ShowcaseInterface) => {
  const response = await axios.post('/api/showcases', showcase);
  return response.data;
};

export const updateShowcaseById = async (id: string, showcase: ShowcaseInterface) => {
  const response = await axios.put(`/api/showcases/${id}`, showcase);
  return response.data;
};

export const getShowcaseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/showcases/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteShowcaseById = async (id: string) => {
  const response = await axios.delete(`/api/showcases/${id}`);
  return response.data;
};
