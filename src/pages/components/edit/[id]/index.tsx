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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getComponentById, updateComponentById } from 'apiSdk/components';
import { Error } from 'components/error';
import { componentValidationSchema } from 'validationSchema/components';
import { ComponentInterface } from 'interfaces/component';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ShowcaseInterface } from 'interfaces/showcase';
import { getShowcases } from 'apiSdk/showcases';

function ComponentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ComponentInterface>(
    () => (id ? `/components/${id}` : null),
    () => getComponentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ComponentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateComponentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/components');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ComponentInterface>({
    initialValues: data,
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
            Edit Component
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'component',
  operation: AccessOperationEnum.UPDATE,
})(ComponentEditPage);
