import { GetServerSideProps } from 'next'
export { default } from './home'

export const getServerSideProps: GetServerSideProps = async () => {
  console.log({
    name: 'Home',
    age: 3600,
    array: [123, 'teste', { name: 'teste' }],
  })

  return {
    props: {},
  }
}
