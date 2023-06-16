import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createComponent } from 'apiSdk/components';
import { Error } from 'components/error';
import { componentValidationSchema } from 'validationSchema/components';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ShowcaseInterface } from 'interfaces/showcase';
import { getShowcases } from 'apiSdk/showcases';
import { ComponentInterface } from 'interfaces/component';

function ComponentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ComponentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createComponent(values);
      resetForm();
      router.push('/components');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ComponentInterface>({
    initialValues: {
      name: '',
      description: '',
      interactive_demo: '',
      showcase_id: (router.query.showcase_id as string) ?? null,
    },
    validationSchema: componentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Component
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="interactive_demo" mb="4" isInvalid={!!formik.errors?.interactive_demo}>
            <FormLabel>Interactive Demo</FormLabel>
            <Input
              type="text"
              name="interactive_demo"
              value={formik.values?.interactive_demo}
              onChange={formik.handleChange}
            />
            {formik.errors.interactive_demo && <FormErrorMessage>{formik.errors?.interactive_demo}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ShowcaseInterface>
            formik={formik}
            name={'showcase_id'}
            label={'Select Showcase'}
            placeholder={'Select Showcase'}
            fetcher={getShowcases}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'component',
  operation: AccessOperationEnum.CREATE,
})(ComponentCreatePage);
