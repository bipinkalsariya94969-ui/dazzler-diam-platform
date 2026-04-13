const { google } = require('googleapis')

const getAuthClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return auth
}

const appendToSheet = async (inquiry) => {
  if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    console.log('Google Sheets not configured — skipping sync')
    return
  }

  try {
    const auth = getAuthClient()
    const sheets = google.sheets({ version: 'v4', auth })

    const row = [
      inquiry._id.toString(),
      new Date(inquiry.createdAt).toLocaleString(),
      inquiry.name || '',
      inquiry.email || '',
      inquiry.phone || '',
      inquiry.country || '',
      inquiry.productType || '',
      inquiry.carat || '',
      inquiry.shape || '',
      inquiry.color || '',
      inquiry.clarity || '',
      inquiry.certification || '',
      inquiry.metal || '',
      inquiry.ringSize || '',
      inquiry.estimatedPrice?.total ? `$${inquiry.estimatedPrice.total.toLocaleString()}` : '',
      inquiry.notes || '',
      inquiry.status || 'new',
      '', // Follow-up date (filled manually)
      '', // Internal notes (filled manually)
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Inquiries!A:S',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    })

    console.log(`✅ Inquiry ${inquiry._id} synced to Google Sheets`)
  } catch (error) {
    console.error('Google Sheets sync error:', error.message)
    throw error
  }
}

const initSheet = async () => {
  if (!process.env.GOOGLE_SHEETS_ID) return

  try {
    const auth = getAuthClient()
    const sheets = google.sheets({ version: 'v4', auth })

    // Set up headers
    const headers = [
      'ID', 'Submitted At', 'Name', 'Email', 'Phone', 'Country',
      'Product Type', 'Carat', 'Shape', 'Colour', 'Clarity', 'Certification',
      'Metal', 'Ring Size', 'Estimated Price', 'Notes', 'Status',
      'Follow-up Date', 'Internal Notes'
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Inquiries!A1:S1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    })

    console.log('✅ Google Sheets headers initialised')
  } catch (error) {
    console.error('Sheet init error:', error.message)
  }
}

module.exports = { appendToSheet, initSheet }
