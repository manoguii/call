import dayjs from 'dayjs'
import { google } from 'googleapis'
import { prisma } from './prisma'

//
export async function getGoogleOauthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      user_id: userId,
      provider: 'google',
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  })

  if (!account.expires_at) {
    return auth
  }

  // --> expires_at é salvo no formato epoch & unix timestamp

  // account.expires_at * 1000 --> converte ( unix timestamp ) para (milissegundos)
  // isTokenExpired --> verifica se a data de expiração do token e anterior a data atual
  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date())

  if (isTokenExpired) {
    // faz o refresh do token
    const { credentials } = await auth.refreshAccessToken()

    const {
      access_token,
      id_token,
      expiry_date,
      refresh_token,
      scope,
      token_type,
    } = credentials

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        id_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null,
        refresh_token,
        scope,
        token_type,
      },
    })

    auth.setCredentials({
      access_token,
      expiry_date,
      refresh_token,
    })
  }

  return auth
}
