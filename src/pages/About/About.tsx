import { Heading } from '~/components/Heading'
import * as S from './About.styles'

export function About() {
  return (
    <S.Page>
      <Heading align="center">About Page</Heading>
      <Heading as="h2" align="center">
        This is the about page description
      </Heading>

      <S.Container>
        <p>
          The Report Tracking System was built with the goal of making internal processes smoother, more transparent,
          and easier to manage. Our mission is to simplify how teams handle data, collaborate, and make informed decisions.
        </p>
        <p>
          Whether you're in product, operations, or management, our system is tailored to help you stay aligned with
          priorities and track what matters most — all in one place.
        </p>
        <p style={{ fontStyle: 'italic', color: '#666' }}>
          Built with a modern stack, designed for speed and clarity. We're just getting started.
        </p>
      </S.Container>
    </S.Page>
  )
}
