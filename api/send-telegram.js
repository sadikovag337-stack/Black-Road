export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Telegram not configured' });
  }

  try {
    const { name, contact, service, subservices, area, total, message } = req.body || {};
    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
    
    let text = '📩 *Новая заявка с сайта Black Road*\n\n';
    if (service) text += `📌 *Услуга:* ${service}\n`;
    if (subservices) text += `🔧 *Подуслуги:* ${subservices}\n`;
    if (area) text += `📐 *Площадь:* ${area} м²\n`;
    if (total) text += `💰 *Итого:* ${total}\n`;
    if (name) text += `👤 *Имя:* ${name}\n`;
    if (contact) text += `📱 *Телефон:* ${contact}\n`;
    if (message && message !== 'Без дополнительной информации') {
      text += `📝 *Сообщение:* ${message}\n`;
    }
    text += `\n🕐 *Время:* ${time}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.description || 'Telegram error');

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}