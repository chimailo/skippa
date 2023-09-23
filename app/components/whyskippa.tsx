import Container from "@/app/components/container";

const whySkippa = [
  { title: 'Enhanced Customer Experience', body: 'With Skippa, you can provide your customers with a seamless and immersive delivery experience. Real-time package tracking, standardized cost models, and a user-friendly interface ensure your customers are always in the loop and satisfied with your services.' },
  { title: 'Streamlined Operations', body: "Say goodbye to manual processes and hello to efficiency! Skippa's suite of tools automates key aspects of your operations, from customer onboarding to order management and delivery tracking. This means fewer errors, faster turnaround times, and optimized resource allocation." },
  { title: 'Increased Visibility and Control', body: "Gain a competitive edge with Skippa's real-time location tracking and order status updates. Stay in control of your delivery operations, make data-driven decisions, and proactively communicate with customers. Build trust and transparency like never before." },
  { title: 'Expanded Customer Base', body: "Unlock new business opportunities by tapping into Skippa's vast customer base. With access to the general public, retail businesses, and delivery companies, you'll have the chance to attract a diverse range of customers and boost your growth potential." },
  { title: 'Efficient Payment Processing', body: 'Bid farewell to payment hassles. Skippa offers a seamless payment processing system that accommodates online payments, wallet transfers, and cash transactions. Simplify your financial transactions, improve cash flow, and delight your customers with convenient payment options.' },
]

export default function WhySkippa() {
  return (
    <section className="bg-primary text-white py-10 w-full">
      <Container compact>
        <h1 className="text-3xl font-bold">Why Choose Skippa?</h1>
        <ul className="grid gap-8 mt-10 grid-cols-[repeat(auto-fill,_minmax(346px,_1fr))]">
          {whySkippa.map((item, i) => <li key={i} className="">
            <h2 className="capitalize font-bold mb-5">{item.title}</h2>
            <p className="text-sm">{item.body}</p>
          </li>)}
        </ul>
      </Container>
    </section>
  );
}
