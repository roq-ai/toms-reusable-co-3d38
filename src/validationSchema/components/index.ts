import * as yup from 'yup';

export const componentValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  interactive_demo: yup.string().required(),
  showcase_id: yup.string().nullable(),
});
