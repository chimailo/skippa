'use client'

import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/app/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import Container from '@/app/components/container'

const companyItems = [
  { label: 'Service Portfolio', link: '/portfolio' },
  { label: 'About', link: '/about' },
  { label: 'Blog', link: '/blog' },
  { label: 'Terms and Conditions', link: '/terms' },
]

const contact = [
  { icon: Facebook, link: 'facebook.com' },
  { icon: Instagram, link: 'instagram.com' },
  { icon: Twitter, link: 'twitter.com' },
  { icon: Linkedin, link: 'linkedin.com' },
]

const whySkippa = [
  { title: 'Enhanced Customer Experience', body: 'With Skippa, you can provide your customers with a seamless and immersive delivery experience. Real-time package tracking, standardized cost models, and a user-friendly interface ensure your customers are always in the loop and satisfied with your services.' },
  { title: 'Streamlined Operations', body: "Say goodbye to manual processes and hello to efficiency! Skippa's suite of tools automates key aspects of your operations, from customer onboarding to order management and delivery tracking. This means fewer errors, faster turnaround times, and optimized resource allocation." },
  { title: 'Increased Visibility and Control', body: "Gain a competitive edge with Skippa's real-time location tracking and order status updates. Stay in control of your delivery operations, make data-driven decisions, and proactively communicate with customers. Build trust and transparency like never before." },
  { title: 'Expanded Customer Base', body: "Unlock new business opportunities by tapping into Skippa's vast customer base. With access to the general public, retail businesses, and delivery companies, you'll have the chance to attract a diverse range of customers and boost your growth potential." },
  { title: 'Efficient Payment Processing', body: 'Bid farewell to payment hassles. Skippa offers a seamless payment processing system that accommodates online payments, wallet transfers, and cash transactions. Simplify your financial transactions, improve cash flow, and delight your customers with convenient payment options.' },
]

type FormData = {
  type: "business" | "individual"
}

const FormSchema = z.object({
  type: z.enum(["business", "individual"], {
    required_error: "You need to select the type of the business.",
  }),
})

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { type: 'business' },
    mode: 'onSubmit',
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <>
      <main className="flex flex-col items-center justify-between">
        <section className="md:px-8">
          <Container className='grid md:grid-flow-col md:auto-cols-fr md:gap-6 gap-12 my-12'>
            <div className="md:my-40">
              <h1 className="text-3xl mb-4 md:mb-6 font-bold">
                Introducing <span className='text-primary'>Skippa:</span> Revolutionizing Logistics for Your Company!
              </h1>
              <p className="text-sm">
                Are you a logistics company looking to elevate your services and provide an exceptional customer experience? Look no further! Skippa is here to transform the way you deliver packages and streamline your operations.
              </p>
            </div>
            <div className="shadow-3xl rounded-lg py-6 px-8 md:py-8 xl:px-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-8 mb-12 lg:20">
                        <h1 className='text-2xl mb-6 md:mb-10 font-bold'>Business Type Selection</h1>
                        <FormLabel className='font-normal'>Please select the business type that best describes you</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-9 lg:space-y-16"
                          >
                            <FormItem className="flex space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="business" />
                              </FormControl>
                              <FormLabel className="font-bold">
                                Registered Business
                                <FormDescription className="mt-3.5 font-normal">
                                  A registered business refers to a legally recognized entity that has undergone the necessary registration and incorporation processes. It typically includes companies, corporations, partnerships, and other formal business structures. Registered businesses are required to provide specific legal documentation during the onboarding process, such as an official business name, registration number, tax identification number, and other relevant information.
                                </FormDescription>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="individual" />
                              </FormControl>
                              <FormLabel className="font-bold">
                                Individual Business
                                <FormDescription className="mt-3.5 font-normal">
                                  An individual business refers to a business operated by a single person without any formal legal structure. This type of business is often referred to as a sole proprietorship. Individual businesses are typically owned and managed by one individual and are not legally separate from the owner. In the onboarding process, individual businesses may be required to provide personal identification information, such as the owner&apos;s name, contact details, and identification documents.
                                </FormDescription>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className='w-full font-bold text-lg xl:text-2xl' size='lg'>Proceed</Button>
                </form>
              </Form>
            </div>
          </Container>
        </section>
        <section className="bg-primary text-white py-10">
          <Container>
            <h1 className="text-3xl font-bold">Why Choose Skippa?</h1>
            <ul className="grid gap-8 mt-10 grid-cols-[repeat(auto-fill,_minmax(360px,_1fr))]">
              {whySkippa.map((item, i) => <li key={i} className="">
                <h2 className="capitalize font-bold mb-5">{item.title}</h2>
                <p className="text-sm">{item.body}</p>
              </li>)}
            </ul>
          </Container>
        </section>
      </main>
      <footer className="py-8 bg-secondary text-slate-100 w-full">
        <div className="grid sm:grid-flow-col sm:auto-cols-fr gap-6 mx-auto max-w-5xl">
          <section className="px-4 md:px-6">
            <h1 className="text-lg font-bold">Company</h1>
            <ul className="my-4">
              {companyItems.map((item, i) => <li key={i} className="">
                <Link href={item.link} className="py-2 block w-full transition-colors  text-white">{item.label}</Link>
              </li>)}
            </ul>
          </section>
          <section className="px-4 md:px-6">
            <h1 className="text-lg font-bold">Products</h1>
          </section>
          <section className="px-4 md:px-6">
            <h1 className="text-lg font-bold">Connect with us</h1>
            <ul className="my-4 flex gap-3 items-center">
              {contact.map((item, i) => <li key={i} className="">
                <a href={`https://${item.link}`} target='_blank' rel='noreferrer noopener' className="transition-colors text-gray-100 hover:text-white">
                  {<item.icon size={18} />}
                </a>
              </li>)}
            </ul>
          </section>
        </div>
      </footer>
    </>
  )
}
