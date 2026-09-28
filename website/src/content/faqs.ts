export type Faq = { q: string; a: string };

const websiteCost =
  "Our websites start from $3,500 + GST for a small business site. Sites with bookings or integrations start from $7,500, and online stores from $12,000. Every site includes SEO setup, mobile optimisation, secure hosting setup and backups.";

export const homeFaqs: Faq[] = [
  { q: "How long does a website take to build?", a: "A standard small business website is usually live 3 weeks after we receive your content. Online stores and larger sites take 4–8 weeks." },
  { q: "How much does a website cost in Australia?", a: websiteCost },
  { q: "How much does SEO cost?", a: "Our monthly SEO plans start from $790 + GST, and a one-off local SEO setup starts from $1,500 + GST. Most small businesses start seeing movement in 3–6 months." },
  { q: "Do you guarantee first-page Google rankings?", a: "No. No honest agency can guarantee rankings, because Google weighs hundreds of factors. We follow every proven best practice and report your rankings and enquiries every month, so you can see exactly what you're getting." },
  { q: "What is SEO and why does my business need it?", a: "SEO (search engine optimisation) is how you get your website to appear when people search for what you do. It covers Google and, increasingly, AI tools like ChatGPT. When someone in your area searches for your service, SEO decides whether they find you or a competitor." },
  { q: "Do you only do websites?", a: "No. We build websites and run SEO, and we also design, build and deploy custom software and cloud solutions, then maintain everything we build. One team, from your first website to the systems your business runs on." },
];

export const faqGroups: { name: string; items: Faq[] }[] = [
  {
    name: "Websites",
    items: [
      { q: "How much does a website cost in Australia?", a: websiteCost },
      { q: "How long does a website take to build?", a: "A Starter site is usually live 3 weeks after we receive your content. Larger sites and online stores take 4–8 weeks." },
      { q: "Do I need to write the content?", a: "No. Send us the key facts about your business and we'll write and polish the copy." },
      { q: "Can I update the website myself?", a: "Yes. You can edit text, photos and blog posts without a developer." },
      { q: "Will I own my website?", a: "Yes. The domain, hosting account, code and content are all in your name." },
    ],
  },
  {
    name: "SEO",
    items: [
      { q: "What is SEO and why does my business need it?", a: "SEO (search engine optimisation) is how you get your website to appear when people search for what you do, on Google and, increasingly, in AI tools like ChatGPT. It decides whether customers find you or a competitor." },
      { q: "How much does SEO cost?", a: "Monthly plans start from $790 + GST. A one-off local SEO setup starts from $1,500 + GST." },
      { q: "How long until I see results?", a: "Usually 3–6 months for meaningful movement. Google Business Profile and technical fixes can show results within weeks." },
      { q: "Do you guarantee first-page Google rankings?", a: "No. No honest agency can guarantee rankings, because Google weighs hundreds of factors. We follow every proven best practice and report your rankings and enquiries every month." },
      { q: "What is AI search (GEO)?", a: "More people now ask ChatGPT, Google AI or Perplexity for recommendations instead of scrolling search results. GEO (generative engine optimisation) makes sure those tools can find, understand and recommend your business." },
    ],
  },
  {
    name: "Hosting & Support",
    items: [
      { q: "Do you host websites?", a: "Yes. Our Hosting & Care plans start from $99/month and include secure hosting, daily backups, updates and monthly changes." },
      { q: "Can you take over a website someone else built?", a: "Yes. We start with a takeover audit to get your logins back and check your site is secure." },
    ],
  },
  {
    name: "Working with us",
    items: [
      { q: "Where are you based?", a: "Melbourne. We meet clients in person around Melbourne and work with businesses across Australia remotely." },
      { q: "Do you only do websites and SEO?", a: "They're our focus. The same team also builds custom software and apps, and sets up Microsoft 365, cloud and cyber security, so you don't need another provider as you grow." },
      { q: "Are your prices ex GST?", a: "Yes. All prices are in AUD and exclude GST." },
    ],
  },
];
