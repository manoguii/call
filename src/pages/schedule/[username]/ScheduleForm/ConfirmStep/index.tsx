import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'
import { CalendarBlank, Clock } from '@phosphor-icons/react'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail valido' }),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const router = useRouter()

  const username = String(router.query.username)

  async function handleConfirmSchedule(data: ConfirmFormData) {
    try {
      setIsLoading(true)

      const { email, name, observations } = data

      await api.post(`/users/${username}/schedule`, {
        name,
        email,
        observations,
        date: schedulingDate,
      })

      onCancelConfirmation()
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

  const describeDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describeTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmSchedule)}>
      <FormHeader>
        <Text>
          {describeDate}
          <CalendarBlank />
        </Text>
        <Text>
          <Clock />
          {describeTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome Completo</Text>
        <TextInput placeholder="seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de email</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>

        {isLoading ? (
          <div
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              width: '120px',
            }}
          >
            <ThreeDots
              height="40"
              width="40"
              color="#4fa94d"
              wrapperStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              visible={true}
            />
          </div>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            Confirmar
          </Button>
        )}
      </FormActions>
    </ConfirmForm>
  )
}
