import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, Form, FormError, Header } from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { ThreeDots } from 'react-loader-spinner'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter no mínimo 3 letras !' })
    .max(20, { message: 'O usuário precisa ter no máximo 20 caracteres !' })
    .regex(/^[A-Za-z][A-Za-z0-9_]{3,20}$/i, {
      message: 'O usuário deve conter apenas letras números e _ !',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(5, { message: 'O nome precisa ter no mínimo 5 letras' })
    .max(25, { message: 'O nome precisa ter no máximo 25 letras' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)

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
      setValue(
        'username',
        Array.isArray(router.query.username)
          ? router.query.username[0]
          : router.query.username,
      )
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      setIsLoading(true)

      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, {
          theme: 'dark',
        })
      }

      console.error(error)
    } finally {
      setIsLoading(false)
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
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="call.com/"
              placeholder="seu-usuário"
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

          {isLoading ? (
            <div>
              <ThreeDots
                height="46"
                width="46"
                radius="9"
                color="#4fa94d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{
                  justifyContent: 'center',
                }}
                visible={true}
              />
            </div>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              Próximo passo
              <ArrowRight />
            </Button>
          )}
        </Form>
      </Container>
    </>
  )
}
