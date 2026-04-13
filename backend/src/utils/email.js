const nodemailer = require('nodemailer')

const createTransport = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const BRAND_COLOR = '#d89a18'
const BRAND_DARK = '#050505'

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: #f0ece4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding: 40px 0 30px; border-bottom: 1px solid rgba(216,154,24,0.2); }
    .logo-text { font-size: 22px; font-weight: 300; letter-spacing: 0.3em; color: #ffffff; }
    .logo-sub { font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: ${BRAND_COLOR}; margin-top: 4px; }
    .content { padding: 40px 0; }
    .gold-line { height: 1px; background: linear-gradient(90deg, transparent, ${BRAND_COLOR}, transparent); margin: 30px 0; }
    .spec-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
    .spec-label { color: rgba(240,236,228,0.4); letter-spacing: 0.05em; }
    .spec-value { color: #ffffff; }
    .cta-btn { display: inline-block; padding: 14px 36px; border: 1px solid ${BRAND_COLOR}; color: ${BRAND_COLOR}; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 30px 0; }
    .footer { text-align: center; padding-top: 30px; border-top: 1px solid rgba(216,154,24,0.1); font-size: 11px; color: rgba(240,236,228,0.25); }
    .social-links { margin: 16px 0; }
    .social-links a { color: ${BRAND_COLOR}; text-decoration: none; margin: 0 8px; font-size: 11px; }
    h2 { font-size: 28px; font-weight: 300; letter-spacing: 0.05em; color: #ffffff; margin-bottom: 16px; }
    p { font-size: 13px; line-height: 1.8; color: rgba(240,236,228,0.65); margin-bottom: 12px; }
    .highlight { color: ${BRAND_COLOR}; }
    .estimate-box { background: rgba(216,154,24,0.05); border: 1px solid rgba(216,154,24,0.2); padding: 24px; margin: 24px 0; text-align: center; }
    .estimate-amount { font-size: 32px; font-weight: 300; color: ${BRAND_COLOR}; }
    .estimate-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(240,236,228,0.3); margin-top: 6px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-text">DAZZLER DIAM</div>
      <div class="logo-sub">Jewels</div>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <div class="social-links">
        <a href="https://www.instagram.com/dazzler_dja">Instagram</a> ·
        <a href="https://pin.it/6nzITgG0o">Pinterest</a> ·
        <a href="https://youtube.com/@dazzlerdja">YouTube</a>
      </div>
      <p>© ${new Date().getFullYear()} Dazzler Diam Jewels. All rights reserved.</p>
      <p style="margin-top: 8px;">Serving USA · UK · Canada · Dubai · Hong Kong</p>
    </div>
  </div>
</body>
</html>
`

const sendInquiryConfirmation = async (inquiry) => {
  if (!process.env.EMAIL_USER) {
    console.log('Email not configured - skipping confirmation email')
    return
  }

  const transporter = createTransport()

  const specsHtml = [
    inquiry.carat && { label: 'Carat Weight', value: `${inquiry.carat}ct` },
    inquiry.shape && { label: 'Shape', value: inquiry.shape },
    inquiry.color && { label: 'Colour Grade', value: inquiry.color },
    inquiry.clarity && { label: 'Clarity Grade', value: inquiry.clarity },
    inquiry.certification && { label: 'Certification', value: inquiry.certification },
    inquiry.metal && { label: 'Metal', value: inquiry.metal },
    inquiry.productType && { label: 'Product Type', value: inquiry.productType },
    inquiry.country && { label: 'Your Country', value: inquiry.country },
  ].filter(Boolean).map(s => `
    <div class="spec-row">
      <span class="spec-label">${s.label}</span>
      <span class="spec-value">${s.value}</span>
    </div>
  `).join('')

  const estimateHtml = inquiry.estimatedPrice?.total ? `
    <div class="estimate-box">
      <div class="estimate-amount">$${inquiry.estimatedPrice.total.toLocaleString()}</div>
      <div class="estimate-label">Estimated Investment</div>
    </div>
  ` : ''

  const html = baseTemplate(`
    <h2>Your Inquiry Has Been Received</h2>
    <p>Dear <span class="highlight">${inquiry.name}</span>,</p>
    <p>Thank you for your inquiry with Dazzler Diam Jewels. We are honoured by your interest and our specialist will review your requirements and contact you within <strong style="color: #fff">24 hours</strong>.</p>
    
    <div class="gold-line"></div>
    <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(240,236,228,0.3); margin-bottom: 16px;">Your Specifications</p>
    ${specsHtml}
    ${estimateHtml}
    <div class="gold-line"></div>
    
    <p>In the meantime, you can explore our collections or reach us directly via WhatsApp for urgent inquiries.</p>
    <div style="text-align: center">
      <a href="https://dazzlerdiamjewels.com" class="cta-btn">Explore Our Collections</a>
    </div>
    <p style="font-size: 11px; color: rgba(240,236,228,0.3);">Reference ID: ${inquiry._id}</p>
  `)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: inquiry.email,
    subject: `Your Diamond Inquiry — Dazzler Diam Jewels`,
    html,
  })
}

const sendAdminNotification = async (inquiry) => {
  if (!process.env.EMAIL_USER) return

  const transporter = createTransport()

  const html = baseTemplate(`
    <h2>New Inquiry Received</h2>
    <p><strong style="color: #fff">From:</strong> ${inquiry.name} (${inquiry.email})</p>
    <p><strong style="color: #fff">Country:</strong> ${inquiry.country || 'Not specified'}</p>
    <p><strong style="color: #fff">Product:</strong> ${inquiry.productType} — ${inquiry.carat || '?'}ct ${inquiry.shape || ''} ${inquiry.color || ''} ${inquiry.clarity || ''} ${inquiry.certification || ''}</p>
    <p><strong style="color: #fff">Metal:</strong> ${inquiry.metal || 'Not specified'}</p>
    ${inquiry.estimatedPrice?.total ? `<p><strong style="color: #fff">Estimate:</strong> <span class="highlight">$${inquiry.estimatedPrice.total.toLocaleString()}</span></p>` : ''}
    ${inquiry.notes ? `<p><strong style="color: #fff">Notes:</strong> ${inquiry.notes}</p>` : ''}
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://dazzlerdiamjewels.com/admin/inquiries" class="cta-btn">View in Dashboard</a>
    </div>
  `)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `🔔 New Inquiry: ${inquiry.name} — ${inquiry.productType || 'Diamond'}`,
    html,
  })
}

module.exports = { sendInquiryConfirmation, sendAdminNotification }
