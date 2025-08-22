import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="bg-bg-dark text-text-light">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
          Terms and Conditions
        </h1>
        
        <div className="prose prose-invert prose-primary max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to MIC3 Solution Group. These terms and conditions outline the rules and regulations 
              for the use of our website and services.
            </p>
            <p className="mb-4">
              By accessing this website or using our services, we assume you accept these terms and conditions in full. 
              Do not continue to use MIC3 Solution Group's website or services if you do not accept all of the terms 
              and conditions stated on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Services</h2>
            <p className="mb-4">
              MIC3 Solution Group provides digital solutions including web development, mobile app development, 
              software consulting, digital marketing, and IT training services. The specifics of each service 
              will be outlined in individual agreements with clients.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">3. Intellectual Property</h2>
            <p className="mb-4">
              Unless otherwise stated, MIC3 Solution Group owns the intellectual property rights for all material 
              on this website and in our services. All intellectual property rights are reserved.
            </p>
            <p className="mb-4">
              You may view and/or print pages from our website for your own personal use subject to restrictions 
              set in these terms and conditions.
            </p>
            <p className="mb-4">
              You must not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Republish material from our website or services</li>
              <li>Sell, rent or sub-license material from our website or services</li>
              <li>Reproduce, duplicate or copy material from our website or services without proper attribution</li>
              <li>Redistribute content from MIC3 Solution Group (unless content is specifically made for redistribution)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">4. User Content</h2>
            <p className="mb-4">
              In these terms and conditions, "User Content" shall mean any audio, video, text, images or other material 
              you choose to display on our website or through our services. By displaying your User Content, you grant 
              MIC3 Solution Group a non-exclusive, worldwide, irrevocable, royalty-free license to use, reproduce, adapt, 
              publish, translate and distribute it in any media.
            </p>
            <p className="mb-4">
              Your User Content must be your own and must not infringe on any third party's rights. MIC3 Solution Group 
              reserves the right to remove any of your content from our website at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">5. Course Enrollment and Payment</h2>
            <p className="mb-4">
              When enrolling in courses offered by MIC3 Solution Group, you agree to pay all fees associated with the course. 
              Payment methods and terms will be clearly outlined during the enrollment process.
            </p>
            <p className="mb-4">
              Course access is granted for the specified duration after payment is confirmed. MIC3 Solution Group 
              reserves the right to modify course content to maintain quality and relevance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">6. Refund Policy</h2>
            <p className="mb-4">
              For courses and digital products, MIC3 Solution Group offers a 7-day money-back guarantee from the date of purchase. 
              Refunds will not be issued after this period. For custom development services, refund policies will be outlined in 
              individual service agreements.
            </p>
            <p className="mb-4">
              To request a refund, contact our support team with your purchase information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall MIC3 Solution Group be liable for any damages (including, without limitation, damages for 
              loss of data or profit, or due to business interruption) arising out of the use or inability to use our 
              materials and services, even if MIC3 Solution Group or a MIC3 Solution Group authorized representative has 
              been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">8. Privacy Policy</h2>
            <p className="mb-4">
              Your privacy is important to us. It is MIC3 Solution Group's policy to respect your privacy regarding any 
              information we may collect from you across our website and other sites we own and operate.
            </p>
            <p className="mb-4">
              We only ask for personal information when we truly need it to provide a service to you. We collect it by 
              fair and lawful means, with your knowledge and consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">9. Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of Kenya, and you 
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">10. Changes to Terms</h2>
            <p className="mb-4">
              MIC3 Solution Group reserves the right to modify these terms at any time. By continuing to access our website 
              and services after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">11. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-bg-dark-light p-4 rounded-lg border border-primary/20">
              <p className="mb-1"><strong>Email:</strong> info@mic3solutiongroup.com</p>
              <p className="mb-1"><strong>Phone:</strong> +254 700 000 000</p>
              <p><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
          </section>

          <div className="mt-12 text-center">
            <p className="text-text-muted text-sm">
              Last updated: August 22, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
