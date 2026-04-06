import twilio from 'twilio'

/**
 * Fire-and-forget WhatsApp notification to admin.
 * Never throws — silently logs on failure so booking creation is unaffected.
 */
export async function notifyAdmin(booking) {
  try {
    const { TWILIO_SID, TWILIO_TOKEN, ADMIN_WHATSAPP } = process.env

    // Skip gracefully if Twilio is not configured yet
    if (!TWILIO_SID || TWILIO_SID.startsWith('AC' + 'xxx') || !TWILIO_TOKEN || TWILIO_TOKEN === 'your_auth_token_here') {
      console.log('[WhatsApp] Twilio not configured — skipping notification')
      return
    }

    const client = twilio(TWILIO_SID, TWILIO_TOKEN)

    const msg =
      `🎮 *New LevelUp Booking*\n\n` +
      `👤 *Customer:* ${booking.customerName}\n` +
      `📞 *Phone:* ${booking.phone}\n` +
      `🖥️ *Station:* ${booking.stationId} (${booking.stationType.toUpperCase()})\n` +
      `📅 *Date:* ${booking.date} @ ${booking.timeSlot}\n` +
      `⏱️ *Duration:* ${booking.durationHours} hour(s)\n` +
      `💰 *Amount:* ₹${booking.pricingINR}\n` +
      (booking.notes ? `📝 *Notes:* ${booking.notes}\n` : '') +
      `\nOpen dashboard to confirm or cancel.`

    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:+${ADMIN_WHATSAPP}`,
      body: msg,
    })

    console.log('[WhatsApp] Admin notification sent')
  } catch (err) {
    console.error('[WhatsApp] Notification failed (non-fatal):', err.message)
  }
}
