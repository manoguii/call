import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, Form, FormError, Header } from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuario precisa ter no minimo 3 letras !' })
    .max(10)
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuario precisa apenas letras e hifens !',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter no minimo 3 letras' })
    .max(25, { message: 'O nome precisa ter no maximo 25 letras' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: any) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data.message) {
        return alert(err.response.data.message)
      }

      console.log(err)
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuario</Text>
            <TextInput
              prefix="call.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />

            {errors.username && (
              <FormError size={'sm'}>{errors.username.message}</FormError>
            )}
          </label>

          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput placeholder="Seu nome" {...register('name')} />

            {errors.name && (
              <FormError size={'sm'}>{errors.name.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
