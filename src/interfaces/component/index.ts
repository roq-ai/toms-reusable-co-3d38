import { ShowcaseInterface } from 'interfaces/showcase';
import { GetQueryInterface } from 'interfaces';

export interface ComponentInterface {
  id?: string;
  name: string;
  description: string;
  interactive_demo: string;
  showcase_id?: string;
  created_at?: any;
  updated_at?: any;

  showcase?: ShowcaseInterface;
  _count?: {};
}

export interface ComponentGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  interactive_demo?: string;
  showcase_id?: string;
}
