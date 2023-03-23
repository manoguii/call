import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'

const updateProfileData = z.object({
  bio: z.string(),
})

type RegisterFormData = z.infer<typeof updateProfileData>

export default function UpdateProfile() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(updateProfileData),
  })

  const session = useSession()

  const router = useRouter()

  async function handleUpdateProfile(data: RegisterFormData) {
    try {
      setIsLoading(true)

      await api.put('/users/profile', {
        bio: data.bio,
      })

      await router.push(`/schedule/${session.data?.user.username}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, {
          theme: 'colored',
        })
      }

      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem vindo ao Call !</Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          {isLoading ? (
            <div>
              <ThreeDots
                height="46"
                width="46"
                color="#4fa94d"
                wrapperStyle={{
                  justifyContent: 'center',
                }}
                visible={true}
              />
            </div>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              Finalizar
              <ArrowRight />
            </Button>
          )}
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
