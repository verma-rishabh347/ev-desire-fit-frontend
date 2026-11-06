
import React from 'react'

const email = 'info@evdesirefit.com'
const green = 'text-[#0f8b5f]'

const sections = [
  ['About us', <>EVDesireFit provides electric vehicle charging products, accessories, charging software and related services. The official registered office, GSTIN and other statutory details should be added here before publishing this page.</>],
  ['Using our services', <>You must be at least 18 years old and legally able to enter a binding contract under Indian law to place an order or book a service. Please provide complete and accurate details for invoices, delivery, installation and warranty support. Our website, WhatsApp, app and software must be used lawfully and must not be misused, disrupted or copied for commercial purposes.</>],
  ['Products, advice & information', <>We make reasonable efforts to describe products accurately, though images may vary slightly in colour or appearance. Charging speed depends on your vehicle’s onboard charger, electrical supply and installation. Recommendations rely on the information you provide, so please check your vehicle manufacturer’s official specifications. Features, specifications and prices may change as products improve.</>],
  ['Orders, prices & payment', <>Orders may be placed through our website or team using a quotation and payment link. An order is confirmed when payment is received, or when the confirmation advance is received for cash on delivery. Prices are in Indian Rupees and include GST unless stated otherwise. Authorised payment partners process payments, and we do not retain card or bank details. We may decline or cancel an order for errors, unavailability, incomplete details or suspected fraud, with refunds returned to the original payment method.</>],
  ['Delivery, installation & service', <>Delivery dates are estimates and depend on location and courier partners. Surveys, installation and on-site service are provided under the applicable service policy. The customer is responsible for site readiness, electrical supply, sanctioned load and required permissions. Issues caused by power supply, building wiring, earthing or other conditions outside the product are not covered by warranty or service.</>],
  ['Our policies', <>The following policies should be linked here and form part of these Terms: Easy Return Policy, Shipping & Exchange Policy, Warranty Policy, Installation & Service Policy and Privacy Policy. Where a policy and these Terms address the same matter differently, the relevant policy applies.</>],
  ['Charging software & apps', <>Chargers may work with EVDesireFit apps and software for managing, monitoring and billing charging stations. The software is licensed, not sold, for use with compatible chargers. Do not copy, modify, reverse engineer or resell it except where law permits or we agree in writing. Updates may be released for features, security and compatibility. Keep login details secure.</>],
  ['Purchases through marketplaces & partners', <>When products are bought through a marketplace or dealer, that seller’s terms govern the order, payment, delivery and returns. The applicable EVDesireFit Warranty Policy applies to the product when proof of purchase is provided.</>],
  ['Communications', <>We may contact you by WhatsApp, SMS, email or phone about orders, delivery, installation, service and warranty. Offers and marketing messages are sent only with your consent, and you can opt out at any time. Some WhatsApp enquiries may receive an automated response, and you may request a team member.</>],
  ['Intellectual property', <>The EVDesireFit name and logo, product designs, website content, software and documentation belong to EVDesireFit or its licensors. They may not be used without written permission. For rights concerns, contact us at <a href={`mailto:${email}`}>{email}</a>.</>],
  ['Limitation of liability', <>Nothing in these Terms limits rights that cannot be limited under the Consumer Protection Act, 2019 or other applicable law. Subject to that protection, total liability relating to a product or service is limited to the amount paid for it. We are not liable for indirect or consequential loss, or loss caused by misuse, improper installation, third-party repairs, use contrary to the manual or conditions outside our control.</>],
  ['Events beyond our control', <>We are not liable for delay or failure caused by events beyond reasonable control, including natural disasters, epidemics, strikes, government action, supply or courier disruption, and power or network outages. We will keep you informed and resume service as soon as reasonably possible.</>],
  ['Governing law & disputes', <>These Terms are governed by the laws of India. Please contact us first so we can try to resolve concerns amicably. Any jurisdiction clause should be completed with EVDesireFit’s official legal details before publication.</>],
  ['Changes to these Terms', <>We may revise these Terms from time to time. The updated version will be posted on this page and will apply to orders placed and services booked after posting.</>],
  ['Grievance redressal', <>For a complaint about a product, order or service, write to the Grievance Officer at <a href={`mailto:${email}`}>{email}</a> with the subject “Grievance”. Add the official postal address and complaint-resolution timeline here before publishing.</>],
]

const termsconditions = () => {
  return (
     <>
    
    <main id="top" className="mx-auto max-w-[1200px] px-[18px] py-16 sm:px-7 sm:py-20">
      <section className="mx-auto mb-10 max-w-[740px] text-center sm:mb-16"><h1 className={`mb-5 text-5xl font-black leading-none tracking-[-.065em] sm:text-7xl ${green}`}>Terms &amp; Conditions</h1><p className="mx-auto mb-5 max-w-xl text-lg text-[#63736b]">A clear guide to buying, using and receiving support for EVDesireFit products and services.</p><p className="inline-flex items-center gap-2 text-xs text-[#63736b]"><span className="h-2 w-2 rounded-full bg-[#0f8b5f] ring-4 ring-[#eaf7f0]"/>Please read before placing an order or booking a service</p></section>
      <div className="grid items-start gap-7 lg:grid-cols-[270px_minmax(0,760px)] lg:justify-center lg:gap-[52px]">
        <aside className="rounded-[18px] border border-[#dce8e1] bg-white p-5 shadow-[0_10px_30px_#133d2810] lg:sticky lg:top-[100px]"><p className="mb-3 text-xs font-extrabold uppercase tracking-[.13em] text-[#0f8b5f]">On this page</p><ol className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:block">{sections.map(([title], i) => <li key={title}><a href={`#section-${i + 1}`} className="block rounded-md px-2 py-1 text-sm text-[#63736b] hover:bg-[#eaf7f0] hover:text-[#075d42]"><span className="mr-2 text-xs text-[#9aaba2]">{String(i + 1).padStart(2, '0')}</span>{title}</a></li>)}</ol></aside>
        <article className="rounded-[22px] border border-[#dce8e1] bg-white p-6 shadow-[0_18px_44px_#133d280c] sm:p-12 lg:p-16">
          <div className="mb-12 border-l-4 border-[#0f8b5f] pl-5 text-[#43534b]"><p>These Terms and Conditions describe how you may purchase and use products and services from <strong>EVDesireFit</strong> (“we”, “us” or “our”), and how you may use our website, WhatsApp, phone, app and other channels.</p><p className="mt-4">They should be read with the policies listed in section 6. By ordering, booking a service, or using our website or software, you confirm that you accept these Terms.</p></div>
          {sections.map(([title, content], i) => <section id={`section-${i + 1}`} key={title} className={`scroll-mt-24 border-b border-[#dce8e1] pb-10 mb-10 last:mb-0 ${i === 14 ? 'rounded-2xl border-0 bg-[#eaf7f0] px-6 pt-6' : ''}`}><h2 className={`mb-4 flex items-baseline gap-3 text-xl font-bold tracking-tight ${green}`}><span className="text-xs tracking-widest text-[#0f8b5f]">{String(i + 1).padStart(2, '0')}</span>{title}</h2><p className="leading-7 text-[#17211d]">{content}</p></section>)}
          <footer className="pt-3 text-center"><p className="mb-4 text-[#63736b]">Questions about these Terms? We’re here to help.</p><a href={`mailto:${email}`} className="inline-flex items-center gap-5 rounded-lg bg-[#0f8b5f] px-5 py-3 font-bold text-white hover:bg-[#075d42]">Write to us <span>→</span></a></footer>
        </article>
      </div>
    </main>
   </>
  )
}

export default termsconditions
