import { Heading } from '~/components/Heading'

import * as S from './Home.styles'

export function Home() {
  return (
    <S.Page>
      <Heading align="center">Home Page</Heading>
      <Heading as="h2" align="center">
        Welcome to the Report Tracking System
      </Heading>

      <S.Container>
        <p>
          This platform helps you manage, review, and track reports with ease and transparency. Whether you're handling
          performance metrics, customer feedback, or internal audits, everything is centralized and easy to access.
        </p>
        <p>
          Reports can be created, versioned, and compared to ensure you always have a clear view of what's changed and
          where action is needed. Our intuitive interface and modern stack allow for quick navigation and seamless collaboration.
        </p>
        <p>
          Stay informed, stay efficient — your reports are now smarter, faster, and better organized.
        </p>
      </S.Container>
    </S.Page>
  )
}
