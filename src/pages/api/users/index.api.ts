import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

interface IResponseData {
  user?: Prisma.UserCreateInput
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'Nome de usuário ja existe',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@call: user-id', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7days
    path: '/',
  })

  return res.status(201).json({ user })
}
