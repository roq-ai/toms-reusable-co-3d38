import axios from 'axios';
import queryString from 'query-string';
import { ComponentInterface, ComponentGetQueryInterface } from 'interfaces/component';
import { GetQueryInterface } from '../../interfaces';

export const getComponents = async (query?: ComponentGetQueryInterface) => {
  const response = await axios.get(`/api/components${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createComponent = async (component: ComponentInterface) => {
  const response = await axios.post('/api/components', component);
  return response.data;
};

export const updateComponentById = async (id: string, component: ComponentInterface) => {
  const response = await axios.put(`/api/components/${id}`, component);
  return response.data;
};

export const getComponentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/components/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteComponentById = async (id: string) => {
  const response = await axios.delete(`/api/components/${id}`);
  return response.data;
};
