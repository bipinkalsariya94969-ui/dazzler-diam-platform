/**
 * DAZZLER DIAM JEWELS — Google Apps Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this entire file
 * 4. Save and Deploy → New deployment → Web app
 * 5. Execute as: Me | Who has access: Anyone
 * 6. Copy the Web App URL → use as GOOGLE_APPS_SCRIPT_URL in your .env
 * 
 * The sheet should have a tab named "Inquiries"
 * Run initHeaders() once manually to set up column headers
 */

const SHEET_NAME = 'Inquiries'
const FOLLOW_UP_SHEET = 'FollowUps'
const BRAND_COLOR = '#d89a18'
const DARK_BG = '#050505'

/**
 * Handle POST requests from the backend
 * This is the webhook endpoint
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const action = data.action || 'addInquiry'

    if (action === 'addInquiry') {
      return addInquiryRow(data.inquiry)
    } else if (action === 'updateStatus') {
      return updateInquiryStatus(data.id, data.status)
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Handle GET requests (test endpoint)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    service: 'Dazzler Diam Jewels — Google Sheets Integration',
    timestamp: new Date().toISOString(),
  })).setMimeType(ContentService.MimeType.JSON)
}

/**
 * Add a new inquiry row
 */
function addInquiryRow(inquiry) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    initHeaders()
  }

  const row = [
    inquiry._id || '',
    formatDate(inquiry.createdAt || new Date()),
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
    inquiry.ringSize ? `${inquiry.ringSize} (${inquiry.ringSizeSystem || 'US'})` : '',
    inquiry.estimatedPrice?.total ? `$${Number(inquiry.estimatedPrice.total).toLocaleString()}` : '',
    inquiry.notes || '',
    inquiry.status || 'new',
    '',  // Follow-up date
    '',  // Internal notes
    '',  // Assigned to
  ]

  sheet.appendRow(row)

  // Style the new row
  const lastRow = sheet.getLastRow()
  styleStatusCell(sheet, lastRow, inquiry.status || 'new')

  // Send email notification (optional — remove if handled by backend)
  // sendEmailNotification(inquiry)

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    row: lastRow,
    message: 'Inquiry added to sheet',
  })).setMimeType(ContentService.MimeType.JSON)
}

/**
 * Update inquiry status by ID
 */
function updateInquiryStatus(inquiryId, newStatus) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) return

  const data = sheet.getDataRange().getValues()
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === inquiryId) {
      sheet.getRange(i + 1, 17).setValue(newStatus) // Column Q = status
      styleStatusCell(sheet, i + 1, newStatus)
      break
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

/**
 * Apply colour coding to status cell
 */
function styleStatusCell(sheet, row, status) {
  const statusColors = {
    new: { bg: '#1e3a5f', text: '#38bdf8' },
    contacted: { bg: '#3d2e00', text: '#edca57' },
    quoted: { bg: '#2d1b5e', text: '#a78bfa' },
    'in-progress': { bg: '#3d1f00', text: '#fb923c' },
    closed: { bg: '#0f3320', text: '#4ade80' },
    cancelled: { bg: '#3d0f0f', text: '#f87171' },
  }
  const colors = statusColors[status] || statusColors.new
  const cell = sheet.getRange(row, 17) // Column Q
  cell.setBackground(colors.bg)
  cell.setFontColor(colors.text)
  cell.setFontWeight('bold')
}

/**
 * Initialise column headers with formatting
 * Run this once manually
 */
function initHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME)

  const headers = [
    'ID', 'Submitted At', 'Name', 'Email', 'Phone', 'Country',
    'Product Type', 'Carat', 'Shape', 'Colour', 'Clarity', 'Certification',
    'Metal', 'Ring Size', 'Estimated Price', 'Notes', 'Status',
    'Follow-up Date', 'Internal Notes', 'Assigned To'
  ]

  const headerRange = sheet.getRange(1, 1, 1, headers.length)
  headerRange.setValues([headers])
  headerRange.setBackground('#0d0d0d')
  headerRange.setFontColor(BRAND_COLOR)
  headerRange.setFontWeight('bold')
  headerRange.setFontSize(10)

  // Freeze header row
  sheet.setFrozenRows(1)

  // Set column widths
  const widths = [200, 140, 140, 200, 130, 100, 110, 70, 120, 60, 70, 110, 150, 90, 130, 200, 100, 120, 200, 120]
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w))

  SpreadsheetApp.getUi().alert('✅ Headers initialised! Your sheet is ready.')
}

/**
 * Format date for sheets
 */
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch {
    return String(dateStr)
  }
}

/**
 * Add a custom menu for manual actions
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💎 Dazzler Diam')
    .addItem('Initialise Headers', 'initHeaders')
    .addItem('Highlight Overdue Follow-ups', 'highlightOverdueFollowUps')
    .addItem('Export New Inquiries', 'exportNewInquiries')
    .addToUi()
}

/**
 * Highlight cells where follow-up date has passed
 */
function highlightOverdueFollowUps() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) return

  const today = new Date()
  const data = sheet.getDataRange().getValues()

  for (let i = 1; i < data.length; i++) {
    const followUpDate = data[i][17] // Column R
    const status = data[i][16] // Column Q

    if (followUpDate && status !== 'closed' && status !== 'cancelled') {
      const date = new Date(followUpDate)
      if (date < today) {
        sheet.getRange(i + 1, 18).setBackground('#5c1a1a').setFontColor('#f87171')
      }
    }
  }

  SpreadsheetApp.getUi().alert('✅ Overdue follow-ups highlighted in red.')
}
