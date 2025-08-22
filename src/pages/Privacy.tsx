import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="bg-bg-dark text-text-light">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert prose-primary max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to MIC3 Solution Group's Privacy Policy. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="mb-4">
              We respect your privacy and are committed to protecting your personal data. Please read this 
              Privacy Policy carefully to understand our practices regarding your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Information We Collect</h2>
            <p className="mb-4">
              We may collect several different types of information for various purposes to provide and 
              improve our services to you:
            </p>
            <h3 className="text-xl font-semibold text-primary mb-2">Personal Data</h3>
            <p className="mb-4">
              While using our services, we may ask you to provide us with certain personally identifiable 
              information that can be used to contact or identify you ("Personal Data"). This may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Address</li>
              <li>Payment information</li>
              <li>Usage data</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mb-2">Usage Data</h3>
            <p className="mb-4">
              We may also collect information on how our services are accessed and used ("Usage Data"). 
              This may include information such as your computer's Internet Protocol address, browser type, 
              browser version, pages visited, time and date of visit, time spent on those pages, and other diagnostic data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">3. Use of Data</h2>
            <p className="mb-4">
              MIC3 Solution Group uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our services</li>
              <li>To monitor the usage of our services</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To process payments and prevent fraud</li>
              <li>To send you marketing and promotional communications (you can opt-out)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">4. Data Security</h2>
            <p className="mb-4">
              The security of your data is important to us but remember that no method of transmission over 
              the Internet or method of electronic storage is 100% secure. While we strive to use commercially 
              acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">5. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track the activity on our services and 
              hold certain information. Cookies are files with small amounts of data which may include an 
              anonymous unique identifier.
            </p>
            <p className="mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
              However, if you do not accept cookies, you may not be able to use some portions of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">6. Third-Party Services</h2>
            <p className="mb-4">
              We may employ third-party companies and individuals to facilitate our services ("Service Providers"), 
              provide the services on our behalf, perform service-related tasks, or assist us in analyzing how 
              our services are used.
            </p>
            <p className="mb-4">
              These third parties have access to your Personal Data only to perform these tasks on our behalf 
              and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We will retain your Personal Data only for as long as is necessary for the purposes set out in this 
              Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our 
              legal obligations, resolve disputes, and enforce our legal agreements and policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">8. Your Data Protection Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain data protection rights. MIC3 Solution Group aims to 
              take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
            </p>
            <p className="mb-4">
              If you wish to be informed what Personal Data we hold about you and if you want it to be removed 
              from our systems, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">9. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this 
              Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-bg-dark-light p-4 rounded-lg border border-primary/20">
              <p className="mb-1"><strong>Email:</strong> privacy@mic3solutiongroup.com</p>
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

export default Privacy;
