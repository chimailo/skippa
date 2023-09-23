import Container from '@/app/components/container'
import Footer from '@/app/components/footer'
import WhySkippa from '@/app/components/whyskippa'
import BusinessTypeForm from '@/app/(home)/components/form'
import HeroText from '@/app/(home)/components/hero'

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-between">
        <Container compact className='grid md:grid-flow-col md:auto-cols-fr md:gap-6 gap-12 my-12'>
          <HeroText />
          <BusinessTypeForm />
        </Container>
        <WhySkippa />
      </main>
      <Footer />
    </>
  )
}
