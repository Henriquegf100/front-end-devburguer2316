import { yupResolver } from '@hookform/resolvers/yup';
import { Image } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ContainerCheckbox, InputGroup, SubmitButton } from './styles';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../../services/api';
import {
  Container,
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
  category: yup.number().required('Escolha a categoria'),
  offer: yup.boolean(), // Corrigido para .boolean() ao invés de .boll()
  file: yup
    .mixed()
    .test('required', 'Escolha um arquivo para continuar', (value) => {
      return value && value.length > 0;
    })
    .test('fileSize', 'Carregue arquivos até 3mb', (value) => {
      return value && value.length > 0 && value[0].size <= 3000000;
    })
    .test('type', 'Carregue apenas imagens PNG ou JPEG', (value) => {
      return (
        value &&
        value.length > 0 &&
        (value[0].type === 'image/jpeg' || value[0].type === 'image/png')
      );
    }),
});

export function NewProduct() {
  const [fileName, setFileName] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get('/categories');
      setCategories(data);
    }
    loadCategories();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const productFormData = new FormData();

    productFormData.append('name', data.name);
    productFormData.append('price', Math.round(data.price * 100)); // Valor convertido para inteiro (em centavos)
    productFormData.append('category_id', data.category);
    productFormData.append('file', data.file[0]);
    productFormData.append('offer', data.offer || false); // Se 'offer' não for passado, usa 'false' como padrão

    await toast.promise(api.post('/products', productFormData), {
      pending: 'Adicionando o produto...',
      success: 'Produto criado com sucesso',
      error: 'Falha ao adicionar o produto, tente novamente',
    });

    setTimeout(() => {
      navigate('/admin/produtos');
    }, 2000);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label>Nome</Label>
          <Input type="text" {...register('name')} />
          <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Preço</Label>
          <Input type="number" {...register('price')} />
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
              onChange={(value) => {
                setFileName(value.target.files[0]?.name);
                register('file').onChange(value);
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
            render={({ field }) => (
              <Select
                {...field}
                options={categories}
                getOptionLabel={(category) => category.name}
                getOptionValue={(category) => String(category.id)}
                placeholder="Categorias"
                menuPortalTarget={document.body}
                onChange={(selectedOption) =>
                  field.onChange(Number(selectedOption.id))
                }
              />
            )}
          />
          <ErrorMessage>{errors?.category?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <ContainerCheckbox>
            <input type="checkbox" {...register('offer')} />
            <Label>Produto em Oferta?</Label>
          </ContainerCheckbox>
        </InputGroup>

        <SubmitButton>Adicionar Produto</SubmitButton>
      </Form>
    </Container>
  );
}
