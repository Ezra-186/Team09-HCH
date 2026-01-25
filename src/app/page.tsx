import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'grid', gap: '3rem' }}>
      <section
        style={{
          display: 'grid',
          gap: '1.5rem',
          padding: '3rem 2rem',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #fff8f2, #f3e4d4)',
          boxShadow: '0 20px 80px rgba(128, 0, 42, 0.12)',
        }}
      >
        <p style={{ letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b59f71' }}>
          HandCraft Heaven
        </p>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '720px' }}>
          <h1 style={{ fontSize: '2.4rem', lineHeight: 1.2 }}>
            Discover one-of-a-kind pieces made by independent artisans.
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#4d001a', lineHeight: 1.6 }}>
            From hand-thrown ceramics to plant-dyed textiles, every item here is crafted with care,
            story, and sustainable materials.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/products"
              style={{
                padding: '0.85rem 1.4rem',
                background: '#80002a',
                color: '#fdf7f2',
                borderRadius: '999px',
                fontWeight: 700,
                boxShadow: '0 10px 30px rgba(128, 0, 42, 0.25)',
              }}
            >
              Browse the collection
            </Link>
            <a
              href="#promise"
              style={{
                padding: '0.85rem 1.4rem',
                borderRadius: '999px',
                border: '1px solid #b59f71',
                color: '#80002a',
                fontWeight: 600,
                background: '#fff',
              }}
            >
              What makes us different
            </a>
          </div>
        </div>
      </section>

      <section
        id="promise"
        style={{
          display: 'grid',
          gap: '1.25rem',
          padding: '0 0.5rem',
        }}
      >
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.6rem' }}>Curated with intention</h2>
          <p style={{ color: '#4d001a', maxWidth: '780px', lineHeight: 1.6 }}>
            We partner directly with small makers to bring together timeless, functional pieces. No
            dropshipping, no mass production—just slow-made goods that you&apos;ll keep for years.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          {[
            {
              title: 'Maker-first marketplace',
              copy: 'Transparent pricing that supports the artisans behind every piece.',
            },
            {
              title: 'Earth-friendly materials',
              copy: 'Natural fibers, reclaimed wood, small-batch glazes, and low-waste packaging.',
            },
            {
              title: 'Thoughtful gifting',
              copy: 'Curated sets and handwritten notes available for every order.',
            },
          ].map((item) => (
            <article
              key={item.title}
              style={{
                border: '1px solid #f1e3d3',
                borderRadius: '12px',
                padding: '1rem',
                background: '#fffdf8',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{item.title}</h3>
              <p style={{ color: '#4d001a', lineHeight: 1.5 }}>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
