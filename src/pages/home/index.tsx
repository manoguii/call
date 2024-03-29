import { Heading, Text } from '@ignite-ui/react'
import { Container, Hero, Preview } from './styles'
import previewImage from '../../assets/app-preview.png'
import bgHero from '../../assets/bg-hero.svg'
import Image from 'next/image'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Agendamento descomplicado | Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <Container>
        <Hero>
          <Image src={bgHero} fill alt="" quality={100} priority />

          <Heading as="h1" size="4xl">
            Agendamento descomplicado
          </Heading>

          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            height={400}
            quality={100}
            alt="Calendário simbolizando aplicação em funcionamento"
            priority
          />
        </Preview>
      </Container>
    </>
  )
}
