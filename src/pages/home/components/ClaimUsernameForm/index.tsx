import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { Form, FormAnnotation } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuario precisa ter no minimo 3 letras !' })
    .max(10)
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuario precisa apenas letras e hifens !',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const { register, handleSubmit, formState } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="manogui.com/"
          placeholder="Seu usuario"
          {...register('username')}
        />
        <Button size={'sm'} type="submit">
          Reservar usuario
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {formState.errors.username
            ? formState.errors.username.message
            : 'Digite o nome do usuario'}
        </Text>
      </FormAnnotation>
    </>
  )
}
