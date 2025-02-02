import { yupResolver } from '@hookform/resolvers/yup';
import { Image } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { InputGroup, SubmitButton } from './styles';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../../services/api';
import {
  Container,
  ContainerCheckbox,
  ErrorMessage,
  Form,
  Input,
  Label,
  LabelUpload,
  Select,
} from './styles';

const schema = yup.object({
  name: yup.string().required('Digite o nome do produto'),
  price: yup
    .number()
    .positive()
    .required('Digite o preço do produto')
    .typeError('Digite o preço do produto'),
  category: yup
    .object()
    .shape({
      id: yup.string().required(),
      name: yup.string().required(),
    })
    .required('Selecione a categoria do produto'),
  offer: yup.bool(),
});

export function EditProduct() {
  const [fileName, setFileName] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const {
    state: { product },
  } = useLocation();

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }

    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log('Dados do formulário:', data);

    const productFormData = new FormData();
    productFormData.append('name', data.name);
    productFormData.append('price', Math.round(data.price * 100));
    productFormData.append('category_id', data.category.id);
    productFormData.append('file', data.file[0]);
    productFormData.append('offer', data.offer);

    try {
      await toast.promise(api.put(`/products/${product.id}`, productFormData), {
        pending: 'Editando Produto...',
        success: 'Produto editado com sucesso!',
        error: 'Falha ao editar o produto',
      });
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    }

    setTimeout(() => {
      navigate('/admin/produtos');
    }, 2000);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label>Nome</Label>
          <Input
            type="text"
            {...register('name')}
            defaultValue={product.name}
          />
          <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Preço</Label>
          <Input
            type="number"
            step="0.01"
            {...register('price')}
            defaultValue={product.price / 100}
          />
          <ErrorMessage>{errors?.price?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <LabelUpload>
            <Image />
            <input
              type="file"
              {...register('file')}
              accept="image/png, image/jpeg"
              style={{ display: 'none' }}
              onChange={(event) => {
                setFileName(event.target.files[0]?.name);
              }}
            />
            {fileName || 'Upload do Produto'}
          </LabelUpload>
          <ErrorMessage>{errors?.file?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Categoria</Label>
          <Controller
            name="category"
            control={control}
            defaultValue={product.category}
            render={({ field }) => (
              <Select
                {...field}
                options={categories}
                getOptionLabel={(category) => category.name}
                getOptionValue={(category) => category.id}
                placeholder="Categorias"
                menuPortalTarget={document.body}
                defaultValue={product.category}
              />
            )}
          />
          <ErrorMessage>{errors?.category?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <ContainerCheckbox>
            <input
              type="checkbox"
              defaultChecked={product.offer}
              {...register('offer')}
            />
            <Label>Produto em Oferta?</Label>
          </ContainerCheckbox>
        </InputGroup>

        <SubmitButton type="submit">Editar Produto</SubmitButton>
      </Form>
    </Container>
  );
}
