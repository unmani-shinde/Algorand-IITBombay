import { ShieldCheck } from "lucide-react"
export default function Features() {
  return (
    <section>
      <div id = "features" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-4xl mx-auto text-center pb-12 md:pb-20" data-aos="fade-right">
            <h2 className="h2 mb-4">How we make sure your <br/>employees are not lying</h2>
            <p className="text-xl text-gray-400">Experience seamless document verification through AlgoTrust: tamper-proof, transparent, and fraud-resistant. Your employee verification, ensured.</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none" data-aos-id-blocks>

            {/* 1st item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-anchor="[data-aos-id-blocks]">
              <div className="w-16 h-16 mb-4 bg-purple-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              <h4 className="h4 mb-2">Tamper-Proof Verification</h4>
              <p className="text-lg text-gray-400 text-center">Ensure document integrity with tamper-proof verification, leveraging advanced technology to safeguard against unauthorized alterations.
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="100" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <circle className="fill-current text-purple-600" cx="32" cy="32" r="32" />
                <path className="stroke-current text-purple-100" strokeWidth="2" strokeLinecap="square" d="M21 23h22v18H21z" fill="none" fillRule="evenodd" />
                <path className="stroke-current text-purple-300" d="M26 28h12M26 32h12M26 36h5" strokeWidth="2" strokeLinecap="square" />
              </svg>
              <h4 className="h4 mb-2">Clear Audit and Visibility</h4>
              <p className="text-lg text-gray-400 text-center">Gain confidence from transparent audits and effortless visibility, fostering informed and confident decision-making.</p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                <g transform="translate(21 21)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                  <ellipse className="stroke-current text-purple-300" cx="11" cy="11" rx="5.5" ry="11" />
                  <path className="stroke-current text-purple-100" d="M11 0v22M0 11h22" />
                  <circle className="stroke-current text-purple-100" cx="11" cy="11" r="11" />
                </g>
              </svg>
              <h4 className="h4 mb-2">Rapid Verification Process</h4>
              <p className="text-lg text-gray-400 text-center">Our Algorand-driven solution streamlines verification through blockchain, expediting authentication for individuals and organizations.</p>
            </div>
          </div>
          <div data-aos="fade-right" data-aos-delay="300" className="mx-auto text-center px-6 py-20">
              <a className="btn text-white bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg shadow mb-4" href="#zigzag">
                Let's get started <span aria-hidden="true">&rarr;</span>
              </a>
          </div>
        </div>
      </div>
    </section>
  )
}
