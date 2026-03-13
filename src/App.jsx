import { useState, useRef } from 'react'
import { QRCode } from 'react-qrcode-logo'
import './App.css'

const QR_ID = 'qr-canvas'

export default function App() {
  const [data, setData] = useState('')
  const [logoDataUri, setLogoDataUri] = useState(null)
  const fileInputRef = useRef(null)

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogoDataUri(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleRemoveLogo() {
    setLogoDataUri(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDownload() {
    const canvas = document.getElementById(QR_ID)
    if (!canvas) return
    const url = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="container">
      <h1>QR Code Generator</h1>

      <div className="form">
        <label htmlFor="qr-data">Data / URL</label>
        <input
          id="qr-data"
          type="text"
          placeholder="Enter text or URL..."
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <label htmlFor="logo-upload">Logo (optional)</label>
        <div className="logo-row">
          <input
            id="logo-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {logoDataUri && (
            <button className="btn-remove" onClick={handleRemoveLogo} title="Remove logo">
              ✕ Remove
            </button>
          )}
        </div>
      </div>

      <div className="qr-wrapper">
        <QRCode
          id={QR_ID}
          value={data || ' '}
          size={280}
          logoImage={logoDataUri || undefined}
          logoWidth={60}
          logoHeight={60}
          removeQrCodeBehindLogo={true}
          qrStyle="dots"
          eyeRadius={4}
        />
      </div>

      <button
        className="btn-download"
        onClick={handleDownload}
        disabled={!data.trim()}
      >
        Download as PNG image
      </button>
    </div>
  )
}
