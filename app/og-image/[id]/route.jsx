import { ImageResponse } from 'next/og'
import { getWishById } from '@/app/actions'

export const runtime = 'edge'

export async function GET(request, { params }) {
  const wish = await getWishById(params.id)
  
  if (!wish) {
    return new Response('Not Found', { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B1224',
          color: 'white',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Simple Gradient Background */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,195,0,0.2) 0%, rgba(11,18,36,0) 70%)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: 20 }}>
            Natal 2025
          </div>
          
          <div style={{ fontSize: 72, fontWeight: 'bold', color: '#FFC300', marginBottom: 20, textShadow: '0 0 20px rgba(255,195,0,0.5)' }}>
            {wish.title}
          </div>

          <div style={{ fontSize: 32, color: '#E2E8F0', fontStyle: 'italic', maxWidth: '800px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {wish.description.substring(0, 60)}{wish.description.length > 60 ? '...' : ''}
          </div>

          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center' }}>
            {/* Visual representation of the star */}
             <div style={{ 
                width: 40, height: 40, 
                backgroundColor: wish.style.color === 'yellow' ? '#FFC300' : wish.style.color === 'red' ? '#EF4444' : '#FFF',
                borderRadius: wish.style.starStyle === 'circle' ? '50%' : '2px',
                transform: 'rotate(45deg)',
                marginRight: 15,
                boxShadow: '0 0 20px white'
             }} />
             <div style={{ fontSize: 24, color: '#94A3B8' }}>
                Desejo de {wish.author}
             </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}